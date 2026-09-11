import type { CRMCustomField } from '~/types/crm'

interface ApiCustomField {
  id: number
  label: string
  section: CRMCustomField['section']
  custom_field_section_id?: number | null
  form_section?: string | null
  form_section_order?: number | null
  type: CRMCustomField['type']
  required: boolean
  default_value?: boolean | null
  is_business_value?: boolean
  visible_when: string
  conditions?: Array<Omit<CRMCustomField['conditions'][number], 'value'> & { value: string | string[] }>
  options?: string[]
  sub_fields?: CRMCustomField['subFields']
  position?: number | null
}

const mapCustomField = (item: ApiCustomField): CRMCustomField => ({
  id: String(item.id),
  label: item.label,
  section: item.section,
  customFieldSectionId: item.custom_field_section_id ? String(item.custom_field_section_id) : null,
  formSection: item.form_section || null,
  formSectionOrder: item.form_section_order ?? 0,
  type: item.type,
  required: item.required,
  defaultValue: item.default_value ?? null,
  isBusinessValue: item.is_business_value ?? false,
  visibleWhen: item.visible_when,
  conditions: (item.conditions || []).map(condition => ({
    ...condition,
    value: Array.isArray(condition.value) ? condition.value.map(String) : [String(condition.value)]
  })),
  options: item.options || [],
  subFields: item.sub_fields || [],
  position: item.position ?? 0
})

/** Loads custom fields without fetching unrelated administration resources. */
export const useCustomFields = () => {
  const { fetchAll } = useApi()
  const customFields = useState<CRMCustomField[]>('crm-custom-fields', () => [])
  const customFieldsLoading = useState('crm-custom-fields-loading', () => false)
  const customFieldsError = useState<string | null>('crm-custom-fields-error', () => null)
  const loaded = useState('crm-custom-fields-loaded', () => false)

  const refreshCustomFields = async () => {
    if (customFieldsLoading.value) return
    customFieldsLoading.value = true
    customFieldsError.value = null
    try {
      customFields.value = (await fetchAll<ApiCustomField>('/custom-fields')).map(mapCustomField)
    } catch (cause) {
      customFieldsError.value = cause instanceof Error ? cause.message : 'Erro ao carregar campos personalizados.'
    } finally {
      loaded.value = true
      customFieldsLoading.value = false
    }
  }

  if (import.meta.client && !loaded.value && !customFieldsLoading.value) void refreshCustomFields()
  return { customFields, refreshCustomFields, customFieldsLoading, customFieldsError }
}
