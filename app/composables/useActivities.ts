import type { ApiActivity } from '~/types/api'

export const useActivities = () => {
  const { fetchAll, request, instanceId } = useApi()
  const session = useSessionStore()
  const todayActivities = useState<ApiActivity[]>('activities-today', () => [])
  const todayLoading = useState('activities-today-loading', () => false)
  const todayError = useState('activities-today-error', () => '')
  const revision = useState('activities-revision', () => 0)
  const todayLoadedAt = useState('activities-today-loaded-at', () => 0)
  const cacheTtl = 60 * 60 * 1000
  const timezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone
  const cacheKey = computed(() => `crm-activities-today:${instanceId.value || 'none'}:${session.user?.id || 'guest'}`)
  const pendingToday = computed(() => todayActivities.value.filter(item => item.status === 'pending'))
  const readCache = () => {
    if (!import.meta.client) return false

    const cached = localStorage.getItem(cacheKey.value)
    if (!cached) return false

    try {
      const parsed = JSON.parse(cached) as { savedAt: number, items: ApiActivity[] }
      if (!parsed.savedAt || Date.now() - parsed.savedAt > cacheTtl) return false
      todayActivities.value = Array.isArray(parsed.items) ? parsed.items : []
      todayLoadedAt.value = parsed.savedAt
      todayError.value = ''
      return true
    } catch {
      localStorage.removeItem(cacheKey.value)
      return false
    }
  }
  const writeCache = (items: ApiActivity[]) => {
    const savedAt = Date.now()
    todayActivities.value = items
    todayLoadedAt.value = savedAt
    if (import.meta.client) localStorage.setItem(cacheKey.value, JSON.stringify({ savedAt, items }))
  }
  const clearTodayCache = () => {
    todayActivities.value = []
    todayLoadedAt.value = 0
    if (import.meta.client) localStorage.removeItem(cacheKey.value)
  }
  const refreshToday = async (options: { force?: boolean } = {}) => {
    if (!instanceId.value) { todayActivities.value = []; return false }
    if (!options.force && todayActivities.value.length && Date.now() - todayLoadedAt.value <= cacheTtl) return true
    if (!options.force && readCache()) return true

    const tenant = instanceId.value
    todayLoading.value = true
    todayError.value = ''
    try {
      const items = await fetchAll<ApiActivity>(`/activities/today?timezone=${encodeURIComponent(timezone())}`)
      if (tenant !== instanceId.value) return false
      writeCache(items)
      return true
    } catch (error) {
      todayError.value = error instanceof Error ? error.message : 'Não foi possível carregar as atividades.'
      return false
    } finally { todayLoading.value = false }
  }
  const listMonth = (start: Date, end: Date) => fetchAll<ApiActivity>(
    `/activities?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`
  )
  const notifyChanged = async () => { revision.value++; clearTodayCache(); await refreshToday({ force: true }) }
  const completeActivity = async (id: number) => {
    await request(`/activities/${id}`, { method: 'PATCH', body: { status: 'completed' } })
    await notifyChanged()
  }
  return { todayActivities, todayLoading, todayError, pendingToday, refreshToday, listMonth, completeActivity, notifyChanged, revision, clearTodayCache }
}
