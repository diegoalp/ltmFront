import type { ApiCollectionResponse, ApiPaginatedResponse } from '~/types/api'

interface ApiErrorBody {
  code?: string
  data?: ApiErrorBody
  error?: {
    code?: string
    message?: string
    details?: { fields?: Record<string, string[]> }
  }
  message?: string
}

/** HTTP error that preserves status and validation fields for callers. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fields: Record<string, string[]> = {},
    public readonly code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Single access point from Vue code to `server/api` routes.
 *
 * It executes requests, synchronizes session cookies, and normalizes the
 * different error formats returned by Laravel.
 */
export const useApi = () => {
  const session = useSessionStore()
  const toast = useToast()
  const { beginQuery, endQuery } = useApiLoading()
  // Cookies let the Nuxt server read the session during SSR and proxy calls.
  const tokenCookie = useCookie<string | null>('crm-auth-token', { sameSite: 'lax' })
  const instanceCookie = useCookie<string | null>('crm-instance-id', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30
  })
  session.hydrate(tokenCookie.value, instanceCookie.value)
  const { token, instanceId } = storeToRefs(session)

  // Synchronous persistence prevents a navigation from starting before the
  // server-readable cookies contain the latest session context.
  watch(token, value => { tokenCookie.value = value }, { flush: 'sync' })
  watch(instanceId, value => { instanceCookie.value = value }, { flush: 'sync' })

  /** Persists the active tenant before any tenant-aware navigation or request. */
  const setInstanceId = (value: string | number | null) => {
    const normalizedValue = value == null || String(value).trim() === ''
      ? null
      : String(value)

    session.selectInstance(normalizedValue)
    instanceCookie.value = normalizedValue
  }

  /** Executes a typed request using a relative path such as `/products`. */
  const request = async <T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) => {
    const method = String(options.method || 'GET').toUpperCase()
    const tracksPageLoading = method === 'GET'
    if (tracksPageLoading) beginQuery()
    try {
      return await $fetch<T>(`/api${path}`, {
        ...options,
        headers: {
          ...options.headers,
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
        }
      })
    } catch (cause: unknown) {
      const fetchError = cause as { data?: ApiErrorBody, status?: number, statusCode?: number }
      const rawBody = fetchError.data
      // Nitro may wrap an upstream Laravel error in `data` when proxying it.
      const body = rawBody?.data && (rawBody.data.error || rawBody.data.message || rawBody.data.code)
        ? rawBody.data
        : rawBody
      const fields = body?.error?.details?.fields || {}
      // Validation errors take priority because they are usually more useful to the UI.
      const fieldMessage = Object.keys(fields).length
        ? Object.values(fields).flat()[0]
        : undefined
      const message = fieldMessage || body?.error?.message || body?.message || 'Não foi possível comunicar com a API.'
      const code = body?.error?.code || body?.code
      if (import.meta.client && code === 'INSTANCE_EXPIRED') void navigateTo('/instancia-expirada')
      // Expected conflicts are handled by the calling screen before any action is taken.
      if (import.meta.client && code !== 'USER_RESTORE_REQUIRED') toast.error(message)
      throw new ApiError(message, fetchError.statusCode || fetchError.status || 500, fields, code)
    } finally {
      if (tracksPageLoading) endQuery()
    }
  }

  /**
   * Walks every page of a Laravel collection and returns one flat list.
   * Use only when a screen truly needs the complete data set.
   */
  const fetchAll = async <T>(path: string): Promise<T[]> => {
    const first = await request<ApiCollectionResponse<T>>(path)
    if (Array.isArray(first)) return first
    if (!Array.isArray(first?.data)) {
      throw new ApiError(`A API retornou uma coleção inválida para ${path}.`, 502)
    }
    const items = [...first.data]
    const lastPage = first.last_page || first.meta?.last_page || 1
    for (let page = 2; page <= lastPage; page += 1) {
      const separator = path.includes('?') ? '&' : '?'
      const response = await request<ApiPaginatedResponse<T>>(`${path}${separator}page=${page}`)
      if (!Array.isArray(response?.data)) {
        throw new ApiError(`A API retornou uma coleção inválida para ${path} na página ${page}.`, 502)
      }
      items.push(...response.data)
    }
    return items
  }

  return { request, fetchAll, token, instanceId, setInstanceId }
}
