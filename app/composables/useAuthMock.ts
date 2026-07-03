import type { CRMUser, LoginPayload } from '~/app/types/crm'

const DEMO_USER: CRMUser = {
  id: 'u-001',
  name: 'Diego Sales',
  role: 'admin',
  initials: 'DS'
}

export const useAuthMock = () => {
  const user = useState<CRMUser | null>('auth-user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)
  const error = useState<string>('auth-error', () => '')

  const isAuthenticated = computed(() => user.value !== null)

  const login = async (payload: LoginPayload) => {
    loading.value = true
    error.value = ''

    await new Promise((resolve) => setTimeout(resolve, 550))

    if (payload.email === 'demo@crm.local' && payload.password === '123456') {
      user.value = DEMO_USER
      loading.value = false
      return true
    }

    error.value = 'Invalid credentials. Use demo@crm.local / 123456'
    loading.value = false
    return false
  }

  const logout = async () => {
    user.value = null
    await navigateTo('/login')
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout
  }
}
