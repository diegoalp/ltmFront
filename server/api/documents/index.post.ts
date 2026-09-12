/** Uploads a document while preserving multipart file data. */
import { buildDocumentStorageFileName } from '#shared/utils/documents'

export default defineEventHandler(event => proxyToLaravel(event, {
  multipartFileName: (part, fields) => {
    if (part.name !== 'file') return undefined
    const documentName = fields.title || fields.document_name || fields.name || 'documento'
    return buildDocumentStorageFileName(documentName, part.filename, part.type)
  }
}))
