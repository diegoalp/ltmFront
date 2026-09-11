import type {
  CRMCustomField, CRMCustomFieldSectionConfig, CRMFunnel, CRMPermissionRole, CRMPublicLeadForm, CRMTask
} from '~/types/crm'
import type { ApiFunnel, ApiStage } from '~/types/api'
interface ApiCustomField {
  id: number, label: string, section: CRMCustomField['section'], custom_field_section_id?: number | null, form_section?: string | null, form_section_order?: number | null, type: CRMCustomField['type'], required: boolean, default_value?: boolean | null, is_business_value?: boolean, visible_when: string,
  conditions?: Array<Omit<CRMCustomField['conditions'][number], 'value'> & { value: string | string[] }>, options?: string[],
  sub_fields?: CRMCustomField['subFields'], position?: number | null
}
interface ApiRole { id: number, key: string, name: string, description: string, permissions: Record<string, boolean> }
interface ApiTask { id: number, title: string, priority: CRMTask['priority'], due_at?: string, business?: { client?: { fullname?: string } }, owner?: { name?: string } }
interface ApiPublicForm { id: number, name: string, headline: string, channel: string, funnel_id: number, fields: string[], active: boolean }
interface ApiCustomFieldSection { id: number, name: string, section: CRMCustomField['section'], position?: number | null }

const colorClass = (color?: string) => color ? '' : 'bg-amber-500'
const expirationLabel = (stage: ApiStage) => stage.duration ? `${stage.duration} ${stage.durationUnit || ''}` : 'Sem expiração'

/**
 * Aggregates settings that are consumed together by the dashboard.
 * A growing domain can be extracted into its own composable without changing pages.
 */
export const useCrmSettings = () => {
  const { request, fetchAll } = useApi()
  const funnels = useState<CRMFunnel[]>('crm-funnels', () => [])
  const customFields = useState<CRMCustomField[]>('crm-custom-fields', () => [])
  const customFieldSections = useState<CRMCustomFieldSectionConfig[]>('crm-custom-field-sections', () => [])
  const roles = useState<CRMPermissionRole[]>('crm-permission-roles', () => [])
  const tasks = useState<CRMTask[]>('crm-tasks', () => [])
  const publicForms = useState<CRMPublicLeadForm[]>('crm-public-forms', () => [])
  const settingsLoading = useState('crm-settings-loading', () => false)
  const settingsError = useState<string | null>('crm-settings-error', () => null)
  const loaded = useState('crm-whitelabel-loaded', () => false)

  /** Loads independent resources in parallel to reduce screen loading time. */
  const refreshSettings = async () => {
    if (settingsLoading.value) return
    settingsLoading.value = true
    settingsError.value = null
    try {
      const [funnelResult, fieldResult, sectionResult, roleResult, taskResult, formResult] = await Promise.allSettled([
        fetchAll<ApiFunnel>('/funnels'), fetchAll<ApiCustomField>('/custom-fields'),
        fetchAll<ApiCustomFieldSection>('/custom-field-sections'),
        fetchAll<ApiRole>('/permission-roles'),
        fetchAll<ApiTask>('/tasks'), fetchAll<ApiPublicForm>('/public-lead-forms')
      ])

      if (funnelResult.status === 'fulfilled') funnels.value = funnelResult.value.map(item => ({
        id: String(item.id), name: item.name, description: item.description || '', ownerTeam: item.ownerTeam || '',
        colorClass: colorClass(item.color), color: item.color || null, active: item.active,
        stages: (item.stages || []).map(stage => ({
          id: stage.id, title: stage.name, expirationLabel: expirationLabel(stage), color: stage.color || item.color || null, isFinal: stage.is_final || false
        }))
      }))
      if (fieldResult.status === 'fulfilled') customFields.value = fieldResult.value.map(item => ({
        id: String(item.id), label: item.label, section: item.section, type: item.type,
        customFieldSectionId: item.custom_field_section_id ? String(item.custom_field_section_id) : null,
        formSection: item.form_section || null, formSectionOrder: item.form_section_order ?? 0,
        required: item.required, defaultValue: item.default_value ?? null, isBusinessValue: item.is_business_value ?? false, visibleWhen: item.visible_when,
        conditions: (item.conditions || []).map(condition => ({
          ...condition,
          value: Array.isArray(condition.value) ? condition.value.map(String) : [String(condition.value)]
        })),
        options: item.options || [], subFields: item.sub_fields || [], position: item.position ?? 0
      }))
      if (sectionResult.status === 'fulfilled') customFieldSections.value = sectionResult.value.map(item => ({
        id: String(item.id), name: item.name, section: item.section, position: item.position ?? 0
      }))
      if (roleResult.status === 'fulfilled') roles.value = roleResult.value.map(item => ({ id: String(item.id), name: item.name, description: item.description || '', permissions: item.permissions }))
      if (taskResult.status === 'fulfilled') tasks.value = taskResult.value.map(item => ({
        id: item.id, title: item.title, dealTitle: item.business?.client?.fullname || 'Sem negócio',
        ownerName: item.owner?.name || 'Sem responsável', dueLabel: item.due_at ? new Date(item.due_at).toLocaleString('pt-BR') : 'Sem prazo', priority: item.priority
      }))
      if (formResult.status === 'fulfilled') publicForms.value = formResult.value.map(item => ({
        id: String(item.id), name: item.name, headline: item.headline, channel: item.channel || '',
        assignedFunnelId: String(item.funnel_id), fields: item.fields || [], active: item.active
      }))

      const failure = [funnelResult, fieldResult, roleResult, taskResult, formResult, sectionResult]
        .find(result => result.status === 'rejected')
      if (failure?.status === 'rejected') {
        settingsError.value = failure.reason instanceof Error ? failure.reason.message : 'Parte das configurações não pôde ser carregada.'
      }
    } finally {
      // A completed attempt is cached even when one resource fails. Explicit
      // refreshes can retry without creating request loops on every component.
      loaded.value = true
      settingsLoading.value = false
    }
  }

  /** Creates the funnel first because stages need the ID returned by the API. */
  const addFunnel = async (payload: Omit<CRMFunnel, 'id' | 'active'>) => {
    const created = await request<{ data: ApiFunnel }>('/funnels', { method: 'POST', body: {
      name: payload.name, description: payload.description, owner_team: payload.ownerTeam, color: '#F59E0B'
    } })
    for (const [index, stage] of payload.stages.entries()) {
      await request('/stages', { method: 'POST', body: { funnel_id: created.data.id, name: stage.title, position: index + 1 } })
    }
    await refreshSettings()
  }
  const customFieldBody = (payload: Omit<CRMCustomField, 'id'>) => ({
      label: payload.label, section: payload.section, type: payload.type, required: payload.required,
      custom_field_section_id: payload.customFieldSectionId ? Number(payload.customFieldSectionId) : null,
      default_value: payload.type === 'checkbox' ? payload.defaultValue : null,
      is_business_value: payload.type === 'currency' ? payload.isBusinessValue : false,
      visible_when: payload.visibleWhen, conditions: payload.conditions,
      options: payload.type === 'select' ? payload.options : null,
      sub_fields: payload.type === 'group' ? payload.subFields : null,
      position: payload.position
  })
  const addCustomField = async (payload: Omit<CRMCustomField, 'id'>) => {
    await request('/custom-fields', { method: 'POST', body: customFieldBody(payload) })
    await refreshSettings()
  }
  const updateCustomField = async (id: string, payload: Omit<CRMCustomField, 'id'>) => {
    await request(`/custom-fields/${id}`, { method: 'PATCH', body: customFieldBody(payload) })
    await refreshSettings()
  }
  const removeCustomField = async (id: string) => {
    await request(`/custom-fields/${id}`, { method: 'DELETE' })
    await refreshSettings()
  }
  const addCustomFieldSection = async (payload: Omit<CRMCustomFieldSectionConfig, 'id'>) => {
    await request('/custom-field-sections', { method: 'POST', body: {
      name: payload.name, section: payload.section, position: payload.position
    } })
    await refreshSettings()
  }
  const updateCustomFieldSection = async (id: string, payload: Omit<CRMCustomFieldSectionConfig, 'id'>) => {
    await request(`/custom-field-sections/${id}`, { method: 'PATCH', body: {
      name: payload.name, section: payload.section, position: payload.position
    } })
    await refreshSettings()
  }
  const removeCustomFieldSection = async (id: string) => {
    await request(`/custom-field-sections/${id}`, { method: 'DELETE' })
    await refreshSettings()
  }
  const togglePermission = async (id: string, key: string) => {
    const role = roles.value.find(item => item.id === id)
    if (!role) return
    const permissions = { ...role.permissions, [key]: !role.permissions[key] }
    await request(`/permission-roles/${id}`, { method: 'PATCH', body: { permissions } })
    role.permissions = permissions
  }
  const addPublicForm = async (payload: Omit<CRMPublicLeadForm, 'id' | 'active'>) => {
    await request('/public-lead-forms', { method: 'POST', body: {
      name: payload.name, headline: payload.headline, channel: payload.channel,
      funnel_id: Number(payload.assignedFunnelId), fields: payload.fields
    } })
    await refreshSettings()
  }

  // The API stores stable keys; this table contains UI labels only.
  const permissionLabels: Record<string, string> = {
    viewOwnDeals: 'Ver próprios negócios', viewTeamDeals: 'Ver negócios da equipe', moveStages: 'Mover etapas',
    editValues: 'Editar valores', exportData: 'Exportar dados', manageSettings: 'Gerenciar configurações'
  }

  if (import.meta.client && !loaded.value && !settingsLoading.value) void refreshSettings()
  return {
    funnels, customFields, customFieldSections, roles, tasks, publicForms, permissionLabels,
    addFunnel, addCustomField, updateCustomField, removeCustomField, addCustomFieldSection, updateCustomFieldSection, removeCustomFieldSection, togglePermission, addPublicForm,
    refreshSettings, settingsLoading, settingsError
  }
}
