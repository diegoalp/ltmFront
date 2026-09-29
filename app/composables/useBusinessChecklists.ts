import type { ApiBusinessChecklist, ApiBusinessChecklistItem, ApiResourceResponse } from '~/types/api'
import type { CRMBusinessChecklist, CRMBusinessChecklistItem } from '~/types/crm'

const mapItem = (item: ApiBusinessChecklistItem): CRMBusinessChecklistItem => ({
  id: item.id,
  label: item.label,
  position: item.position,
  required: item.required,
  done: Boolean(item.done),
  completedAt: item.completed_at || null,
  completedBy: item.completed_by ?? null
})

const mapChecklist = (item: ApiBusinessChecklist): CRMBusinessChecklist => ({
  id: item.id,
  title: item.title,
  description: item.description || '',
  items: (item.items || []).map(mapItem).sort((a, b) => a.position - b.position)
})

export const useBusinessChecklists = (businessId: MaybeRef<number>) => {
  const { request } = useApi()
  const key = String(unref(businessId))
  const checklists = useState<CRMBusinessChecklist[]>(`business-checklists-${key}`, () => [])
  const loading = useState(`business-checklists-loading-${key}`, () => false)
  const loaded = useState(`business-checklists-loaded-${key}`, () => false)

  const load = async () => {
    loading.value = true
    try {
      const response = await request<ApiBusinessChecklist[] | ApiResourceResponse<ApiBusinessChecklist[]>>(`/businesses/${unref(businessId)}/checklists`)
      const items = 'data' in response ? response.data : response
      checklists.value = (items || []).map(mapChecklist)
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const toggleItem = async (checklistId: number, itemId: number, done: boolean) => {
    const response = await request<{ data: { checklist_item_id: number, done: boolean, completed_at?: string | null, completed_by?: number | null } }>(`/businesses/${unref(businessId)}/checklists/${checklistId}/items/${itemId}/completion`, {
      method: 'PATCH',
      body: { done }
    })
    const result = response.data
    for (const checklist of checklists.value) {
      const item = checklist.items.find(entry => entry.id === result.checklist_item_id)
      if (item) {
        item.done = result.done
        item.completedAt = result.completed_at || null
        item.completedBy = result.completed_by ?? null
      }
    }
  }

  const totalItems = computed(() => checklists.value.reduce((total, checklist) => total + checklist.items.length, 0))
  const completedItems = computed(() => checklists.value.reduce((total, checklist) => total + checklist.items.filter(item => item.done).length, 0))
  const completionPercent = computed(() => totalItems.value ? Math.round((completedItems.value / totalItems.value) * 100) : 0)

  return { checklists, loading, loaded, load, toggleItem, totalItems, completedItems, completionPercent }
}
