export default defineEventHandler(event => proxyToLaravel(event, { tenantAware: false }))
