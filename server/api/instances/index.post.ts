/** Creates an instance outside the tenant-scoped request flow. */
export default defineEventHandler(event => proxyToLaravel(event, { tenantAware: false }))
