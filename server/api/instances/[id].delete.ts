/** Deletes one instance. */
export default defineEventHandler(event => proxyToLaravel(event, { tenantAware: false }))
