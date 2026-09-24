import type { ApiInstance, ApiResourceResponse } from '~/types/api'
export default defineNuxtRouteMiddleware(async (to) => {
  const { token, instanceId, request } = useApi()
  const { restore, isAuthenticated, user } = useAuth()
  if (token.value && !isAuthenticated.value) await restore()
  const publicPage = ['/login', '/cadastro'].includes(to.path)
  if (!isAuthenticated.value) return publicPage ? undefined : navigateTo('/login')
  const master = user.value?.role === 'master'
  const mustCreate = !master && user.value?.instanceId == null
  const mustChoose = master && !instanceId.value
  if (mustCreate || mustChoose) {
    if (to.path !== '/instancias') return navigateTo('/instancias')
    return
  }
  if (to.path === '/instancias') {
    if (!master) return navigateTo('/')
    return
  }
  if (publicPage) return navigateTo('/')
  const role = String(user.value?.role || '').toLowerCase()
  if (to.path.startsWith('/configuracoes') && role === 'seller') return navigateTo('/')
  if (to.path === '/instancia-expirada') return
  if (instanceId.value) {
    const response = await request<ApiResourceResponse<ApiInstance>>(`/instances/${instanceId.value}`)
    if (response.data.is_expired) return navigateTo('/instancia-expirada')
  }
})
