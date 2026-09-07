import type { ApiActivity, ApiActivityAssignee, ApiResourceResponse } from '~/types/api'
import type { CRMActivity } from '~/types/crm'

const mapActivity = (item: ApiActivity): CRMActivity => ({ id: item.id, title: item.title, description: item.description || '', scheduledAt: item.scheduled_at, status: item.status, activityTypeId: item.activity_type_id, activityTypeName: item.activity_type?.activity_type || 'Atividade', activityTypeColor: item.activity_type?.color || '#4f46e5', ownerName: item.user?.name || 'Usuário' })

export const useBusinessActivities = (businessId: MaybeRef<number>) => {
  const { request, fetchAll } = useApi()
  const { notifyChanged } = useActivities()
  const assignees = ref<ApiActivityAssignee[]>([])
  const assigneesLoading = ref(false)
  const assigneesError = ref('')
  const loadAssignees = async () => {
    const id = unref(businessId)
    assigneesLoading.value = true
    assigneesError.value = ''
    assignees.value = []
    try {
      const items = await fetchAll<ApiActivityAssignee>(`/activities/assignees?business_id=${id}`)
      if (id === unref(businessId)) assignees.value = items
    } catch (cause) {
      if (id === unref(businessId)) assigneesError.value = cause instanceof Error ? cause.message : 'Não foi possível carregar os responsáveis.'
    } finally { assigneesLoading.value = false }
  }
  const activities = ref<CRMActivity[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const loadActivities = async () => { loading.value = true; try { activities.value = (await fetchAll<ApiActivity>(`/activities?business_id=${unref(businessId)}`)).map(mapActivity) } finally { loading.value = false } }
  const addActivity = async (body: { title: string, description?: string, scheduled_at: string, activity_type_id: number, user_id: number }) => { saving.value = true; try { await request<ApiActivity | ApiResourceResponse<ApiActivity>>('/activities', { method: 'POST', body: { ...body, scheduled_at: new Date(body.scheduled_at).toISOString(), business_id: unref(businessId) } }); await loadActivities(); await notifyChanged() } finally { saving.value = false } }
  const setStatus = async (id: number, status: CRMActivity['status']) => { const response = await request<ApiActivity | ApiResourceResponse<ApiActivity>>(`/activities/${id}`, { method: 'PATCH', body: { status } }); const item = mapActivity('data' in response ? response.data : response); activities.value = activities.value.map(activity => activity.id === id ? item : activity); await notifyChanged() }
  const removeActivity = async (id: number) => { await request(`/activities/${id}`, { method: 'DELETE' }); activities.value = activities.value.filter(item => item.id !== id); await notifyChanged() }
  return { assignees, assigneesLoading, assigneesError, loadAssignees, activities, loading, saving, loadActivities, addActivity, setStatus, removeActivity }
}
