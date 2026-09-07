import type { CRMUser, LoginPayload } from '~/app/types/crm'
import type { ApiUser } from '~/types/api'

interface AuthResponse {
  user: ApiUser
  token: string
}

/** Converts the Laravel contract into the compact model consumed by components. */
const mapUser = (user: ApiUser): CRMUser => {
  const name = [user.name, user.lastname].filter(Boolean).join(' ')
  return {
    id: user.id,
    name,
    role: user.type || 'seller',
    instanceId: user.instance_id ?? null,
    funnelId: user.funnel_id ?? null,
    initials: name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
  }
}

export const useAuth = () => {
  const { request, token } = useApi()
  const session = useSessionStore()
  const activityReminderSeen = useCookie<boolean>('crm-activity-reminder-seen', { sameSite: 'lax' })
  const { user, isAuthenticated } = storeToRefs(session)
  const loading = useState<boolean>('auth-loading', () => false)
  const error = useState<string>('auth-error', () => '')

  /** Authenticates and saves the user/token atomically in the store. */
  const login = async (payload: LoginPayload) => {
    loading.value = true
    error.value = ''

    try {
      const response = await request<AuthResponse>('/auth/login', { method: 'POST', body: payload })
      activityReminderSeen.value = false
      session.setAuthenticated(mapUser(response.user), response.token)
      return true
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Credenciais inválidas.'
      session.clear()
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (payload: { name: string, email: string, password: string, password_confirmation: string }) => {
    loading.value = true
    error.value = ''
    try {
      const response = await request<AuthResponse>('/auth/register', { method: 'POST', body: payload })
      activityReminderSeen.value = false
      session.setAuthenticated(mapUser(response.user), response.token)
      return true
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Não foi possível criar sua conta.'
      return false
    } finally { loading.value = false }
  }

  /**
   * Restores the user after a page refresh.
   * The token comes from the cookie, but user data must be validated by the API.
   */
  const restore = async () => {
    if (!token.value || user.value) return Boolean(user.value)
    try {
      const response = await request<{ user: ApiUser }>('/auth/me')
      user.value = mapUser(response.user)
      if (response.user.instance_id != null) {
        session.selectInstance(String(response.user.instance_id))
      }
      return true
    } catch {
      session.clear()
      return false
    }
  }

  /** Clears the local session even when remote token revocation fails. */
  const logout = async () => {
    try { await request('/auth/logout', { method: 'POST' }) } catch { /* token local ainda deve ser removido */ }
    activityReminderSeen.value = false
    session.clear()
    await navigateTo('/login')
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    restore,
    logout
  }
}
