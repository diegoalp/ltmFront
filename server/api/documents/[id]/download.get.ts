export default defineEventHandler(event => proxyToLaravel(event, { binary: true }))
