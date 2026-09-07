import type { ApiDocumentType } from '~/types/api'
import type { CRMCatalogItem } from '~/types/crm'

export const useDocumentTypes = () => {
  const { fetchAll, request } = useApi()
  const documentTypes = useState<CRMCatalogItem[]>('document-types', () => [])
  const loading = ref(false)
  const loadDocumentTypes = async () => { loading.value = true; try { documentTypes.value = (await fetchAll<ApiDocumentType>('/document-types')).map(item => ({ id: item.id, name: item.name, active: item.active ?? true })) } finally { loading.value = false } }
  const addDocumentType = async (name: string) => { await request('/document-types', { method: 'POST', body: { name } }); await loadDocumentTypes() }
  const removeDocumentType = async (id: number) => { await request(`/document-types/${id}`, { method: 'DELETE' }); documentTypes.value = documentTypes.value.filter(item => item.id !== id) }
  return { documentTypes, loading, loadDocumentTypes, addDocumentType, removeDocumentType }
}
