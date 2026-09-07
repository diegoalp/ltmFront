/** Proxies document downloads, updates, and removals to Laravel. */
export default defineEventHandler(event => proxyToLaravel(event))
