import type { CRMCustomField } from '~/types/crm'
import type { ApiCustomField } from '~/types/api'
import { mapCustomField } from '~/utils/customFields'

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
