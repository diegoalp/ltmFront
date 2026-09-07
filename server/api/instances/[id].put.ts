/** Replaces the editable data for one instance. */
export default defineEventHandler(event => proxyToLaravel(event, { tenantAware: false }))
