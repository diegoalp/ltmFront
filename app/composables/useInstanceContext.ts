import type { CRMInstance } from '~/types/crm'
import type { ApiInstance, ApiResourceResponse } from '~/types/api'

interface InstancesEnvelope { data?: ApiInstance[] | { data?: ApiInstance[] }, instances?: ApiInstance[] }
type InstancesResponse = ApiInstance[] | InstancesEnvelope
export interface CreateInstancePayload { name: string, logoFile: File | null, primaryColor: string, secondaryColor: string, accentColor: string, primaryTextColor: string, expiration_date?: string }
type CreateInstanceResponse = ApiInstance | ApiResourceResponse<ApiInstance>

const extractInstances = (response: InstancesResponse): ApiInstance[] | null => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response.instances)) return response.instances
  if (Array.isArray(response.data)) return response.data
  if (response.data && !Array.isArray(response.data) && Array.isArray(response.data.data)) return response.data.data
  return null
}

export const useInstanceContext = () => {
  const { request, instanceId, setInstanceId } = useApi()
  const { user } = useAuth()
  const instances = useState<CRMInstance[]>('available-instances', () => [])
  const loading = useState('instances-loading', () => false)
  const creating = useState('instance-creating', () => false)
  const selecting = useState('instance-selecting', () => false)
  const deleting = useState('instance-deleting', () => false)
  const error = useState('instances-error', () => '')
  const loaded = useState('instances-loaded', () => false)
  const canSelectInstance = computed(() => user.value?.role.toLowerCase() === 'master')
  const needsInstanceSelection = computed(() => canSelectInstance.value && !instanceId.value)
  const loadInstances = async () => {
    if (!user.value || loading.value) return
    loading.value = true; error.value = ''
    try {
      const rows = extractInstances(await request<InstancesResponse>('/instances'))
      if (!rows) throw new Error('A API retornou uma lista de instâncias inválida.')
      instances.value = rows.filter(item => item?.id != null).map(item => ({ id: item.id, name: item.name || `Instância ${item.id}`, expirationDate: item.expiration_date, isExpired: item.is_expired }))
    } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Não foi possível carregar as instâncias.' }
    finally { loaded.value = true; loading.value = false }
  }
  const selectInstance = async (value: string | number, redirect = true) => {
    const selectedId = String(value)
    if (!instances.value.some(item => String(item.id) === selectedId)) { error.value = 'A instância selecionada não está disponível.'; return false }
    if (instances.value.find(item => String(item.id) === selectedId)?.isExpired) { error.value = 'Instância expirada. Solicite a reativação pelo master.'; return false }
    selecting.value = true; error.value = ''
    try { setInstanceId(selectedId); if (redirect) await navigateTo('/'); return true } finally { selecting.value = false }
  }
  const createInstance = async (payload: CreateInstancePayload) => {
    creating.value = true; error.value = ''
    try {
      const { logoFile, ...instancePayload } = payload
      const response = await request<CreateInstanceResponse>('/instances', { method: 'POST', body: { ...instancePayload, name: payload.name.trim() } })
      const instance = 'data' in response ? response.data : response
      instances.value.push({ id: instance.id, name: instance.name || payload.name.trim(), expirationDate: instance.expiration_date, isExpired: instance.is_expired })
      if (user.value && user.value.role !== 'master') {
        user.value.instanceId = instance.id
        user.value.role = 'admin'
      }
      setInstanceId(String(instance.id))
      if (logoFile && !instance.is_expired) {
        const logoBody = new FormData()
        logoBody.append('logo', logoFile)
        await request('/branding/logo', { method: 'POST', body: logoBody })
      }
      if (instance.is_expired) await navigateTo('/instancia-expirada')
      else await selectInstance(String(instance.id))
      return true
    } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Não foi possível criar a instância.'; return false }
    finally { creating.value = false }
  }
  const deleteInstance = async (id: string | number) => {
    deleting.value = true; error.value = ''
    try {
      await request(`/instances/${id}`, { method: 'DELETE' })
      instances.value = instances.value.filter(item => String(item.id) !== String(id))
      return true
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Não foi possível remover a instância.'
      return false
    } finally { deleting.value = false }
  }
  const activateInstance = async (id: number | string, expirationDate: string) => {
    await request(`/instances/${id}/activate`, { method: 'PATCH', body: { expiration_date: expirationDate } })
    await loadInstances()
  }
  return { instances, instanceId, loading, creating, selecting, deleting, error, canSelectInstance, needsInstanceSelection, loadInstances, selectInstance, createInstance, deleteInstance, activateInstance }
}
