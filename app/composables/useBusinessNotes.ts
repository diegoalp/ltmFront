import type { ApiCollectionResponse, ApiNote, ApiResourceResponse } from '~/types/api'
import type { CRMNote } from '~/types/crm'

const unwrap = (response: ApiCollectionResponse<ApiNote>) => Array.isArray(response) ? response : response.data
const mapNote = (note: ApiNote): CRMNote => ({ id: note.id, body: note.body, authorName: note.user?.name || 'Usuário', createdAt: note.created_at })

export const useBusinessNotes = (businessId: MaybeRef<number>) => {
  const { request, fetchAll } = useApi()
  const notes = ref<CRMNote[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const loadNotes = async () => { loading.value = true; try { notes.value = (await fetchAll<ApiNote>(`/notes?business_id=${unref(businessId)}`)).map(mapNote) } finally { loading.value = false } }
  const addNote = async (body: string) => { saving.value = true; try { const response = await request<ApiNote | ApiResourceResponse<ApiNote>>('/notes', { method: 'POST', body: { business_id: unref(businessId), body } }); const note = 'data' in response ? response.data : response; notes.value.unshift(mapNote(note)) } finally { saving.value = false } }
  const removeNote = async (id: number) => { await request(`/notes/${id}`, { method: 'DELETE' }); notes.value = notes.value.filter(note => note.id !== id) }
  return { notes, loading, saving, loadNotes, addNote, removeNote }
}
