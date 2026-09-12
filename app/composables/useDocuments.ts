import type { ApiDocument, ApiResourceResponse } from '~/types/api'
import type { CRMDocument } from '~/types/crm'
import { buildDocumentDownloadUrl, buildDocumentStorageFileName } from '#shared/utils/documents'

type DocumentOwnerType = 'business'

const unwrapResource = (response: ApiDocument | ApiResourceResponse<ApiDocument>): ApiDocument =>
  'data' in response ? response.data : response

const getDocumentOpenUrl = (document: ApiDocument) =>
  document.file_url || document.url || document.download_url || buildDocumentDownloadUrl({
    id: document.id,
    objectId: document.object_id,
    title: document.title,
    type: document.type
  })

const mapDocument = (document: ApiDocument): CRMDocument => {
  const downloadUrl = buildDocumentDownloadUrl({
    id: document.id,
    objectId: document.object_id,
    title: document.title,
    type: document.type
  })

  return {
    id: document.id,
    title: document.title,
    type: document.type,
    objectId: document.object_id,
    fileName: document.original_name || document.file.split('/').pop() || document.title,
    fileUrl: downloadUrl,
    downloadUrl,
    mimeType: document.mime_type || null,
    createdAt: document.created_at || null
  }
}

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
    body.append('file', payload.file, buildDocumentStorageFileName(payload.title, payload.file.name, payload.file.type))
    body.append('type', payload.type)
    body.append('object_id', String(payload.objectId))

    const response = await request<ApiDocument | ApiResourceResponse<ApiDocument>>('/documents', {
      method: 'POST',
      body
    })
    return mapDocument(unwrapResource(response))
  }

  const removeDocument = (id: number) => request(`/documents/${id}`, { method: 'DELETE' })

  const getDocumentUrl = async (document: CRMDocument) => {
    const query = new URLSearchParams({
      document_name: document.title,
      id: String(document.objectId),
      object_id: String(document.objectId),
      title: document.title,
      type: document.type
    })
    const response = await request<ApiDocument | ApiResourceResponse<ApiDocument>>(`/documents/${document.id}/url?${query}`)
    return getDocumentOpenUrl(unwrapResource(response))
  }

  return { listDocuments, uploadDocument, removeDocument, getDocumentUrl }
}
