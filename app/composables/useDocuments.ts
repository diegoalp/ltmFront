import type { ApiCollectionResponse, ApiDocument, ApiResourceResponse } from '~/types/api'
import type { CRMDocument } from '~/types/crm'

type DocumentOwnerType = 'business'

const unwrapCollection = (response: ApiCollectionResponse<ApiDocument>): ApiDocument[] =>
  Array.isArray(response) ? response : response.data

const unwrapResource = (response: ApiDocument | ApiResourceResponse<ApiDocument>): ApiDocument =>
  'data' in response ? response.data : response

const mapDocument = (document: ApiDocument): CRMDocument => ({
  id: document.id,
  title: document.title,
  fileName: document.original_name || document.file.split('/').pop() || document.title,
  fileUrl: document.file_url || document.url || `/api/documents/${document.id}/download`,
  downloadUrl: document.download_url || `/api/documents/${document.id}/download`,
  mimeType: document.mime_type || null,
  createdAt: document.created_at || null
})

/** Owns document API transport and maps storage details away from the UI. */
export const useDocuments = () => {
  const { request, fetchAll } = useApi()

  const listDocuments = async (type: DocumentOwnerType, objectId: number | string) => {
    const query = new URLSearchParams({ type, object_id: String(objectId) })
    const documents = await fetchAll<ApiDocument>(`/documents?${query}`)
    return documents.map(mapDocument)
  }

  const uploadDocument = async (payload: { title: string, documentTypeId: number, file: File, type: DocumentOwnerType, objectId: number | string }) => {
    const body = new FormData()
    body.append('title', payload.title)
    body.append('document_type_id', String(payload.documentTypeId))
    body.append('file', payload.file)
    body.append('type', payload.type)
    body.append('object_id', String(payload.objectId))

    const response = await request<ApiDocument | ApiResourceResponse<ApiDocument>>('/documents', {
      method: 'POST',
      body
    })
    return mapDocument(unwrapResource(response))
  }

  const removeDocument = (id: number) => request(`/documents/${id}`, { method: 'DELETE' })

  return { listDocuments, uploadDocument, removeDocument }
}
