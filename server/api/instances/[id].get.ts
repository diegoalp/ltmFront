/** Returns one instance by ID. */
export default defineEventHandler(event => proxyToLaravel(event, { tenantAware: false }))
