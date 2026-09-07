/** Uploads a document while preserving multipart file data. */
export default defineEventHandler(event => proxyToLaravel(event))
