import type { ApiChecklist, ApiCollectionResponse, ApiResourceResponse } from '~/types/api'
import type { CRMChecklist, CRMChecklistCondition, CRMChecklistItem } from '~/types/crm'

const mapChecklist = (item: ApiChecklist): CRMChecklist => ({
  id: item.id,
  title: item.title,
  description: item.description || '',
  active: item.active,
  funnelIds: (item.funnels || []).map(funnel => String(funnel.id)),
  funnelNames: (item.funnels || []).map(funnel => funnel.name || `Funil #${funnel.id}`),
  items: (item.items || []).map(entry => ({ id: entry.id, label: entry.label, position: entry.position, required: entry.required })),
  conditions: (item.conditions || []).map(condition => ({
    id: condition.id,
    funnelId: String(condition.funnel_id),
    productIds: (condition.product_ids || []).map(Number),
    minStageId: condition.min_stage_id == null ? null : Number(condition.min_stage_id)
  })),
  createdAt: item.created_at,
  updatedAt: item.updated_at
})

export type ChecklistPayload = {
  title: string
  description: string | null
  active: boolean
  funnelIds: string[]
  items: CRMChecklistItem[]
  conditions: CRMChecklistCondition[]
}

const toPayload = (payload: ChecklistPayload, instanceId: string | null) => ({
  instance_id: instanceId ? Number(instanceId) : undefined,
  title: payload.title.trim(),
  description: payload.description?.trim() || null,
  active: payload.active,
  funnel_ids: payload.funnelIds.map(Number),
  items: payload.items.map((item, index) => ({
    ...(item.id ? { id: item.id } : {}),
    label: item.label.trim(),
    position: index + 1,
    required: item.required
  })),
  conditions: payload.conditions.map(condition => ({
    funnel_id: Number(condition.funnelId),
    product_ids: condition.productIds.map(Number),
    min_stage_id: condition.minStageId == null ? null : Number(condition.minStageId)
  }))
})

export const useChecklists = () => {
  const { request, instanceId } = useApi()
  const checklists = useState<CRMChecklist[]>('crm-checklists', () => [])
  const page = useState('crm-checklists-page', () => 1)
  const lastPage = useState('crm-checklists-last-page', () => 1)
  const total = useState('crm-checklists-total', () => 0)
  const loading = useState('crm-checklists-loading', () => false)
  const saving = useState('crm-checklists-saving', () => false)
  const error = useState<string | null>('crm-checklists-error', () => null)

  const load = async (requestedPage = page.value) => {
    loading.value = true
    error.value = null
    try {
      const response = await request<ApiCollectionResponse<ApiChecklist>>(`/checklists?page=${requestedPage}`)
      if (Array.isArray(response)) {
        checklists.value = response.map(mapChecklist)
        page.value = 1
        lastPage.value = 1
        total.value = response.length
      } else {
        checklists.value = (response.data || []).map(mapChecklist)
        page.value = response.current_page || requestedPage
        lastPage.value = response.last_page || response.meta?.last_page || 1
        total.value = response.total || checklists.value.length
      }
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Não foi possível carregar as checklists.'
    } finally {
      loading.value = false
    }
  }

  const save = async (payload: ChecklistPayload, id?: number) => {
    saving.value = true
    try {
      const response = await request<ApiChecklist | ApiResourceResponse<ApiChecklist>>(id ? `/checklists/${id}` : '/checklists', {
        method: id ? 'PATCH' : 'POST',
        body: toPayload(payload, instanceId.value)
      })
      const created = 'data' in response ? response.data : response
      return mapChecklist(created)
    } finally {
      saving.value = false
    }
  }

  const remove = async (id: number) => {
    await request(`/checklists/${id}`, { method: 'DELETE' })
    checklists.value = checklists.value.filter(item => item.id !== id)
    total.value = Math.max(0, total.value - 1)
  }

  return { checklists, page, lastPage, total, loading, saving, error, load, save, remove }
}
