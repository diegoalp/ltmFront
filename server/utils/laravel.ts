import type { H3Event } from 'h3'

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

interface ProxyOptions {
  /** Disable for global routes such as authentication and instance management. */
  tenantAware?: boolean
  binary?: boolean
}

/**
 * Proxies a Nuxt route to its Laravel equivalent.
 *
 * Responsibilities:
 * - keep `NUXT_API_KEY` server-side;
 * - forward the session token;
 * - include the selected instance in multi-tenant operations;
 * - preserve method, query string, and body.
 *
 * Resource-specific rules belong in `server/api/<resource>`.
 */
export const proxyToLaravel = async (event: H3Event, options: ProxyOptions = {}) => {
  const config = useRuntimeConfig(event)
  const method = event.method.toUpperCase()
  // `/api/products/10` no Nuxt corresponde a `/api/products/10` no Laravel.
  const apiPath = getRequestURL(event).pathname.replace(/^\/api\/?/, '')
  // Browser requests already carry the current bearer token. The cookie is a
  // fallback for SSR and requests made before the Pinia state is restored.
  const incomingAuthorization = getHeader(event, 'authorization')
  const cookieToken = getCookie(event, 'crm-auth-token')
  const authorization = incomingAuthorization?.startsWith('Bearer ')
    ? incomingAuthorization
    : cookieToken
      ? `Bearer ${cookieToken}`
      : null
  const incomingInstanceId = getHeader(event, 'x-crm-instance-id')
  const persistedInstanceId = getCookie(event, 'crm-instance-id')
  const requestedInstanceId = incomingInstanceId || persistedInstanceId
  const instanceId = options.tenantAware === false || !/^\d+$/.test(requestedInstanceId || '')
    ? null
    : requestedInstanceId
  const query = { ...getQuery(event) } as Record<string, string | number | boolean | undefined>

  // Laravel reads the instance from query parameters on GET and from the body
  // on methods that can carry a request payload.
  if (instanceId && method === 'GET') query.instance_id = instanceId

  let body: Record<string, unknown> | FormData | undefined
  if (METHODS_WITH_BODY.has(method)) {
    const contentType = getHeader(event, 'content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const multipartBody = new FormData()
      const parts = await readMultipartFormData(event) || []

      for (const part of parts) {
        if (!part.name) continue
        if (part.filename) {
          multipartBody.append(part.name, new Blob([part.data], { type: part.type }), part.filename)
        } else {
          multipartBody.append(part.name, part.data.toString())
        }
      }

      if (instanceId) multipartBody.set('instance_id', instanceId)
      body = multipartBody
    } else {
      const jsonBody = (await readBody<Record<string, unknown> | null>(event)) || {}
      if (instanceId) jsonBody.instance_id = Number(instanceId)
      body = jsonBody
    }
  }

  const url = `${config.apiBase}/api/${apiPath}`
  const fetchOptions = {
    method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    query,
    body,
    headers: {
      'x-api-key': config.apiKey,
      Accept: options.binary ? '*/*' : 'application/json',
      ...(authorization ? { Authorization: authorization } : {})
    }
  }
  if (options.binary) {
    const response = await $fetch.raw<ArrayBuffer>(url, { ...fetchOptions, responseType: 'arrayBuffer' })
    setResponseHeader(event, 'Content-Type', response.headers.get('content-type') || 'application/octet-stream')
    setResponseHeader(event, 'Content-Disposition', response.headers.get('content-disposition') || 'attachment')
    setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
    setResponseHeader(event, 'Cache-Control', 'private, no-store')
    return Buffer.from(response._data || new ArrayBuffer(0))
  }
  return await $fetch(url, fetchOptions)
}
