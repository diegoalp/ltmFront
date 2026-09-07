import type { ApiActivityType } from '~/types/api'
import type { CRMActivityType } from '~/types/crm'

const mapItem = (item: ApiActivityType): CRMActivityType => ({ id: item.id, name: item.activity_type, color: item.color || '#4f46e5', active: item.active ?? true, funnelIds: (item.funnel_ids || []).map(String) })

export const useActivityTypes = () => {
  const { fetchAll, request } = useApi()
  const activityTypes = useState<CRMActivityType[]>('activity-types', () => [])
  const loading = ref(false)
  const loadActivityTypes = async () => { loading.value = true; try { activityTypes.value = (await fetchAll<ApiActivityType>('/activity-types')).map(mapItem) } finally { loading.value = false } }
  const addActivityType = async (body: { name: string, funnelIds?: string[] }) => { await request('/activity-types', { method: 'POST', body: { activity_type: body.name, funnel_ids: (body.funnelIds || []).map(Number) } }); await loadActivityTypes() }
  const removeActivityType = async (id: number) => { await request(`/activity-types/${id}`, { method: 'DELETE' }); activityTypes.value = activityTypes.value.filter(item => item.id !== id) }
  return { activityTypes, loading, loadActivityTypes, addActivityType, removeActivityType }
}
