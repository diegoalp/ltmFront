const MIME_EXTENSION_MAP: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

export const slugifyDocumentName = (name: string) => {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'documento'
}

export const getDocumentFileExtension = (fileName = '', mimeType = '') => {
  const cleanFileName = fileName.split(/[?#]/)[0] || ''
  const extension = cleanFileName.includes('.')
    ? cleanFileName.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
    : ''

  return extension || MIME_EXTENSION_MAP[mimeType.toLowerCase()] || ''
}

export const buildDocumentStorageFileName = (documentName: string, originalFileName = '', mimeType = '') => {
  const extension = getDocumentFileExtension(originalFileName, mimeType)
  return `${slugifyDocumentName(documentName)}${extension ? `.${extension}` : ''}`
}

export const buildDocumentDownloadUrl = (document: {
  id: number | string
  objectId: number | string
  title: string
  type: string
}) => {
  const query = new URLSearchParams({
    document_name: document.title,
    id: String(document.objectId),
    object_id: String(document.objectId),
    title: document.title,
    type: document.type
  })

  return `/api/documents/${document.id}/download?${query}`
}
