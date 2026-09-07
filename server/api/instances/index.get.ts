/** Lists the instances available to the authenticated user. */
export default defineEventHandler(event => proxyToLaravel(event, { tenantAware: false }))
