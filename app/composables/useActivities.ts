import type { ApiActivity } from '~/types/api'

export const useActivities = () => {
  const { fetchAll, request, instanceId } = useApi()
  const todayActivities = useState<ApiActivity[]>('activities-today', () => [])
  const todayLoading = useState('activities-today-loading', () => false)
  const todayError = useState('activities-today-error', () => '')
  const revision = useState('activities-revision', () => 0)
  const timezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone
  const pendingToday = computed(() => todayActivities.value.filter(item => item.status === 'pending'))
  const refreshToday = async () => {
    if (!instanceId.value) { todayActivities.value = []; return false }
    const tenant = instanceId.value
    todayLoading.value = true
    todayError.value = ''
    try {
      const items = await fetchAll<ApiActivity>(`/activities/today?timezone=${encodeURIComponent(timezone())}`)
      if (tenant !== instanceId.value) return false
      todayActivities.value = items
      return true
    } catch (error) {
      todayError.value = error instanceof Error ? error.message : 'Não foi possível carregar as atividades.'
      return false
    } finally { todayLoading.value = false }
  }
  const listMonth = (start: Date, end: Date) => fetchAll<ApiActivity>(
    `/activities?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`
  )
  const notifyChanged = async () => { revision.value++; await refreshToday() }
  const completeActivity = async (id: number) => {
    await request(`/activities/${id}`, { method: 'PATCH', body: { status: 'completed' } })
    await notifyChanged()
  }
  return { todayActivities, todayLoading, todayError, pendingToday, refreshToday, listMonth, completeActivity, notifyChanged, revision }
}
