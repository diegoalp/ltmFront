import type { DealCard, DealStage, KanbanColumn } from '~/types/crm'
import type { ApiBusiness } from '~/types/api'

import { extractCustomFields } from '~/utils/customFieldDisplay'

const mapBusiness = (item: ApiBusiness): DealCard => ({
  id: item.id, title: item.client?.fullname || `Cliente #${item.client_id}`, phone: item.client?.phones?.[0]?.number || '',
  document: item.client?.registration || '', birthDate: item.client?.birthdate || '', categoryId: item.category_id,
  gender: item.client?.gender || '', address: [item.client?.street, item.client?.district].filter(Boolean).join(', '),
  city: item.client?.city || '', state: item.client?.state || '', zipCode: item.client?.zipcode || '',
  profession: item.client?.profession || '',
  bank: String(item.customData?.bank || item.custom_data?.bank || ''), productId: item.product_id, ownerId: item.user_id,
  ownerName: [item.user?.name, item.user?.lastname].filter(Boolean).join(' ') || 'Sem responsável',
  stage: Math.min(Math.max(item.stage?.position || 1, 1), 6) as DealStage,
  funnelId: String(item.funnel_id), funnelStageId: String(item.stage_id), value: Number(item.value),
  expirationDate: item.expiration_date || null,
  priority: item.priority || 'medium', dueDate: item.dueDate || '', createdAt: item.created_at,
  timeline: item.timeline || [], conversation: item.conversation || [],
  customFields: { ...extractCustomFields(item.customData), ...extractCustomFields(item.custom_data) },
  clientCustomFields: { ...extractCustomFields(item.client?.extra), ...extractCustomFields(item.client?.customData), ...extractCustomFields(item.client?.custom_data) },
  status: item.status === 2 ? 'won' : item.status === 0 || item.lossReason ? 'lost' : 'active', lossReason: item.lossReason || null
})

export const useKanbanData = () => {
  const { request, fetchAll, instanceId } = useApi()
  const { funnels } = useFunnels()
  const { isDealDisabled } = useBusinessExpiration()
  const deals = useState<DealCard[]>('kanban-deals', () => [])
  const dealsLoading = useState('kanban-deals-loading', () => false)
  const dealsError = useState<string | null>('kanban-deals-error', () => null)
  const loaded = useState('kanban-deals-loaded', () => false)

  /** Reloads deals and keeps any error available for the page. */
  const refreshDeals = async () => {
    dealsLoading.value = true
    dealsError.value = null
    const requestedInstance = instanceId.value
    try {
      const items = (await fetchAll<ApiBusiness>('/businesses')).map(mapBusiness)
      if (instanceId.value !== requestedInstance) return
      deals.value = items
      loaded.value = true
    } catch (cause) {
      dealsError.value = cause instanceof Error ? cause.message : 'Erro ao carregar negócios.'
    } finally { dealsLoading.value = false }
  }

  // The home uses the first funnel; the pipeline page uses the parameterized helpers below.
  const firstFunnel = computed(() => funnels.value[0])
  const columns = computed<KanbanColumn[]>(() => (firstFunnel.value?.stages || []).map(stage => ({
    id: stage.id || stage.title, title: stage.title, color: stage.color || firstFunnel.value?.color || null, isFinal: stage.isFinal || false
  })))
  const totalPipeline = computed(() => deals.value.reduce((sum, card) => sum + card.value, 0))
  const cardsByColumn = computed<Record<string, DealCard[]>>(() => Object.fromEntries(
    columns.value.map(column => [String(column.id), deals.value.filter(card => card.funnelStageId === String(column.id))])
  ))
  const funnelColumns = (funnelId: string): KanbanColumn[] => {
    const funnel = funnels.value.find(item => item.id === funnelId)
    return (funnel?.stages || []).map(stage => ({
      id: stage.id || stage.title, title: stage.title, color: stage.color || funnel?.color || null, isFinal: stage.isFinal || false
    }))
  }
  const dealsByFunnel = (id: string) => deals.value.filter(card => card.funnelId === id)
  const totalByFunnel = (id: string) => dealsByFunnel(id).reduce((sum, card) => sum + card.value, 0)
  const cardsByFunnelColumn = (id: string): Record<string, DealCard[]> => Object.fromEntries(
    funnelColumns(id).map(column => [String(column.id), dealsByFunnel(id).filter(card => card.funnelStageId === String(column.id))])
  )
  /**
   * Uses an optimistic update so drag-and-drop feels immediate.
   * On failure, it restores exactly the fields that were changed.
   */
  const moveDealInFunnel = async (dealId: number, funnelId: string, stageId: string) => {
    const deal = deals.value.find(item => item.id === dealId)
    if (!deal || isDealDisabled(deal)) return
    const previous = { funnelId: deal.funnelId, funnelStageId: deal.funnelStageId, stage: deal.stage }
    const stageIndex = funnelColumns(funnelId).findIndex(column => String(column.id) === stageId)
    deal.funnelId = funnelId
    deal.funnelStageId = stageId
    deal.stage = Math.min(Math.max(stageIndex + 1, 1), 6) as DealStage
    try { await request(`/businesses/${dealId}`, { method: 'PATCH', body: { funnel_id: Number(funnelId), stage_id: Number(stageId) } }); await refreshDeals() }
    catch (cause) { Object.assign(deal, previous); dealsError.value = cause instanceof Error ? cause.message : 'Erro ao mover negócio.' }
  }
  /** Home compatibility: accepts either a numeric position or the real stage ID. */
  const moveDeal = async (dealId: number, stage: DealStage | string) => {
    const target = columns.value.find((_, index) => index + 1 === Number(stage)) || columns.value.find(column => String(column.id) === String(stage))
    if (target && firstFunnel.value) await moveDealInFunnel(dealId, firstFunnel.value.id, String(target.id))
  }
  const findDealById = (id: number) => deals.value.find(item => item.id === id)

  watch(instanceId, () => {
    deals.value = []
    loaded.value = false
  })
  return {
    columns, deals, totalPipeline, cardsByColumn, funnelColumns, dealsByFunnel, totalByFunnel,
    cardsByFunnelColumn, moveDeal, moveDealInFunnel, findDealById, refreshDeals, dealsLoading, dealsError
  }
}
