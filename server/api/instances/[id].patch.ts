/** Partially updates one instance. */
export default defineEventHandler(event => proxyToLaravel(event, { tenantAware: false }))
