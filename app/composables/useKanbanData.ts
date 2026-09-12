import type { DealCard, DealStage, KanbanColumn } from '~/types/crm'
import type { ApiBusiness, ApiCollectionResponse, ApiPaginatedResponse, ApiResourceResponse } from '~/types/api'

import { extractCustomFields } from '~/utils/customFieldDisplay'

type DealsFilter = { status?: 'won' | 'lost' | null }

interface StagePaginationState {
  page: number
  lastPage: number
  total: number
  loading: boolean
  loaded: boolean
  funnelId: string | null
  status: DealsFilter['status']
}

const mapBusiness = (item: ApiBusiness): DealCard => ({
  id: item.id, clientId: item.client_id, title: item.client?.fullname || `Cliente #${item.client_id}`,
  clientType: item.client?.type || 'individual', phone: item.client?.phones?.[0]?.number || '',
  document: item.client?.registration || '', birthDate: item.client?.birthdate || '', categoryId: item.category_id,
  gender: item.client?.gender || '', address: [item.client?.street, item.client?.district].filter(Boolean).join(', '),
  city: item.client?.city || '', state: item.client?.state || '', zipCode: item.client?.zipcode || '',
  profession: item.client?.profession || '',
  bank: String(item.customData?.bank || item.custom_data?.bank || ''), productId: item.product_id, ownerId: item.user_id,
  ownerName: [item.user?.name, item.user?.lastname].filter(Boolean).join(' ') || 'Sem responsável',
  stage: Math.min(Math.max(item.stage?.position || 1, 1), 6) as DealStage,
  funnelId: String(item.funnel_id), funnelStageId: String(item.stage_id), value: Number(item.value),
  notes: item.notes || null, leadSourceId: item.lead_source_id ?? null,
  expirationDate: item.expiration_date || null,
  priority: item.priority || 'medium', dueDate: item.dueDate || '', createdAt: item.created_at,
  timeline: item.timeline || [], conversation: item.conversation || [],
  customFields: { ...extractCustomFields(item.customData), ...extractCustomFields(item.custom_data) },
  clientCustomFields: { ...extractCustomFields(item.client?.extra), ...extractCustomFields(item.client?.customData), ...extractCustomFields(item.client?.custom_data) },
  status: item.status === 2 ? 'won' : item.status === 0 || item.lossReason ? 'lost' : 'active', lossReason: item.lossReason || null
})

export const useKanbanData = () => {
  const { request, instanceId } = useApi()
  const { funnels } = useFunnels()
  const { isDealDisabled } = useBusinessExpiration()
  const deals = useState<DealCard[]>('kanban-deals', () => [])
  const dealsLoading = useState('kanban-deals-loading', () => false)
  const dealsError = useState<string | null>('kanban-deals-error', () => null)
  const loaded = useState('kanban-deals-loaded', () => false)
  const stagePagination = useState<Record<string, StagePaginationState>>('kanban-stage-pagination', () => ({}))

  const statusQueryValue = (status: DealsFilter['status']) => status === 'won' ? 2 : status === 'lost' ? 0 : null
  const normalizeCollection = <T>(response: ApiCollectionResponse<T>): ApiPaginatedResponse<T> => {
    if (Array.isArray(response)) {
      return { data: response, current_page: 1, last_page: 1, total: response.length }
    }

    return response
  }

  const buildBusinessesPath = (params: Record<string, string | number | null | undefined>) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value == null || value === '') return
      query.set(key, String(value))
    })

    const search = query.toString()
    return search ? `/businesses?${search}` : '/businesses'
  }

  const replaceStageDeals = (stageId: string, nextDeals: DealCard[]) => {
    const stage = String(stageId)
    deals.value = [
      ...deals.value.filter(card => card.funnelStageId !== stage),
      ...nextDeals
    ]
  }

  const appendStageDeals = (stageId: string, nextDeals: DealCard[]) => {
    const stage = String(stageId)
    const currentStageDeals = deals.value.filter(card => card.funnelStageId === stage)
    const incomingIds = new Set(nextDeals.map(card => card.id))
    deals.value = [
      ...deals.value.filter(card => card.funnelStageId !== stage),
      ...currentStageDeals.filter(card => !incomingIds.has(card.id)),
      ...nextDeals
    ]
  }

  const stagePageState = (stageId: KanbanColumn['id']): StagePaginationState => stagePagination.value[String(stageId)] || {
    page: 0,
    lastPage: 1,
    total: 0,
    loading: false,
    loaded: false,
    funnelId: null,
    status: null
  }

  const stageHasMore = (stageId: KanbanColumn['id']) => {
    const state = stagePageState(stageId)
    return state.loaded && state.page < state.lastPage
  }

  const setStagePageState = (stageId: string, patch: Partial<StagePaginationState>) => {
    stagePagination.value = {
      ...stagePagination.value,
      [stageId]: {
        ...stagePageState(stageId),
        ...patch
      }
    }
  }

  const loadStageDeals = async (
    stageId: KanbanColumn['id'],
    options: DealsFilter & { funnelId?: string | null, page?: number, replace?: boolean } = {}
  ) => {
    const stage = String(stageId)
    const currentState = stagePageState(stage)
    if (currentState.loading) return

    const page = options.page || (currentState.page + 1 || 1)
    const replace = options.replace ?? page === 1
    const requestedInstance = instanceId.value
    setStagePageState(stage, {
      loading: true,
      funnelId: options.funnelId ?? currentState.funnelId,
      status: options.status ?? null
    })
    dealsError.value = null

    try {
      const response = normalizeCollection(await request<ApiCollectionResponse<ApiBusiness>>(buildBusinessesPath({
        funnel_id: options.funnelId,
        stage_id: stage,
        status: statusQueryValue(options.status),
        page
      })))
      if (instanceId.value !== requestedInstance) return
      const items = response.data.map(mapBusiness)
      if (replace) replaceStageDeals(stage, items)
      else appendStageDeals(stage, items)
      setStagePageState(stage, {
        page: response.current_page || page,
        lastPage: response.last_page || response.meta?.last_page || 1,
        total: response.total ?? items.length,
        loading: false,
        loaded: true,
        funnelId: options.funnelId ?? null,
        status: options.status ?? null
      })
      loaded.value = true
    } catch (cause) {
      setStagePageState(stage, { loading: false })
      dealsError.value = cause instanceof Error ? cause.message : 'Erro ao carregar negócios.'
    }
  }

  const loadNextStagePage = async (
    stageId: KanbanColumn['id'],
    options: DealsFilter & { funnelId?: string | null } = {}
  ) => {
    const state = stagePageState(stageId)
    if (state.loading || (state.loaded && state.page >= state.lastPage)) return
    await loadStageDeals(stageId, {
      funnelId: options.funnelId ?? state.funnelId,
      status: options.status ?? state.status,
      page: state.loaded ? state.page + 1 : 1,
      replace: !state.loaded
    })
  }

  const refreshStagesDeals = async (
    stages: KanbanColumn['id'][],
    options: DealsFilter & { funnelId?: string | null } = {}
  ) => {
    const stageIds = stages.map(stage => String(stage))
    dealsLoading.value = true
    dealsError.value = null
    deals.value = deals.value.filter(card => !stageIds.includes(String(card.funnelStageId)))
    stagePagination.value = Object.fromEntries(
      Object.entries(stagePagination.value).filter(([stage]) => !stageIds.includes(stage))
    )

    try {
      await Promise.all(stageIds.map(stage => loadStageDeals(stage, {
        funnelId: options.funnelId,
        status: options.status,
        page: 1,
        replace: true
      })))
    } finally {
      dealsLoading.value = false
    }
  }

  /** Reloads deals and keeps any error available for the page. */
  const refreshDeals = async (filters: DealsFilter & { funnelId?: string | null, stageIds?: KanbanColumn['id'][] } = {}) => {
    if (filters.stageIds?.length) {
      await refreshStagesDeals(filters.stageIds, filters)
      return
    }

    dealsLoading.value = true
    dealsError.value = null
    const requestedInstance = instanceId.value
    const status = statusQueryValue(filters.status)
    const stageIds = filters.funnelId
      ? funnelColumns(filters.funnelId).map(column => String(column.id))
      : columns.value.map(column => String(column.id))

    if (stageIds.length) {
      try {
        await refreshStagesDeals(stageIds, filters)
      } finally {
        dealsLoading.value = false
      }
      return
    }

    const path = buildBusinessesPath({ status })
    try {
      const response = normalizeCollection(await request<ApiCollectionResponse<ApiBusiness>>(path))
      const items = response.data.map(mapBusiness)
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
    try {
      await request(`/businesses/${dealId}`, { method: 'PATCH', body: { funnel_id: Number(funnelId), stage_id: Number(stageId) } })
      await refreshDeals({ funnelId, stageIds: [...new Set([previous.funnelStageId, stageId].filter(Boolean).map(String))] })
    }
    catch (cause) { Object.assign(deal, previous); dealsError.value = cause instanceof Error ? cause.message : 'Erro ao mover negócio.' }
  }
  /** Home compatibility: accepts either a numeric position or the real stage ID. */
  const moveDeal = async (dealId: number, stage: DealStage | string) => {
    const target = columns.value.find((_, index) => index + 1 === Number(stage)) || columns.value.find(column => String(column.id) === String(stage))
    if (target && firstFunnel.value) await moveDealInFunnel(dealId, firstFunnel.value.id, String(target.id))
  }
  const assignDealOwner = async (dealId: number, userId: number) => {
    const deal = deals.value.find(item => item.id === dealId)
    if (!deal || isDealDisabled(deal)) return

    const previous = { ownerId: deal.ownerId, ownerName: deal.ownerName }
    deal.ownerId = userId

    try {
      const response = await request<ApiBusiness | ApiResourceResponse<ApiBusiness>>(`/businesses/${dealId}`, {
        method: 'PATCH',
        body: { user_id: userId }
      })
      const item = mapBusiness('data' in response ? response.data : response)
      deals.value = deals.value.map(card => card.id === dealId ? item : card)
    } catch (cause) {
      Object.assign(deal, previous)
      dealsError.value = cause instanceof Error ? cause.message : 'Erro ao atribuir negócio.'
      throw cause
    }
  }
  const loadDealById = async (id: number) => {
    const response = await request<ApiBusiness | ApiResourceResponse<ApiBusiness>>(`/businesses/${id}`)
    const item = mapBusiness('data' in response ? response.data : response)
    const exists = deals.value.some(card => card.id === item.id)
    deals.value = exists
      ? deals.value.map(card => card.id === item.id ? item : card)
      : [...deals.value, item]
    return item
  }
  const findDealById = (id: number) => deals.value.find(item => item.id === id)

  watch(instanceId, () => {
    deals.value = []
    stagePagination.value = {}
    loaded.value = false
  })
  return {
    columns, deals, totalPipeline, cardsByColumn, funnelColumns, dealsByFunnel, totalByFunnel,
    cardsByFunnelColumn, moveDeal, moveDealInFunnel, assignDealOwner, loadDealById, findDealById, refreshDeals,
    loadNextStagePage, stagePageState, stageHasMore, dealsLoading, dealsError
  }
}
