import type { ApiCustomField } from '~/types/api'
import type { CRMCustomField } from '~/types/crm'

/** Keep field settings and business forms on the same API mapping. */
export const mapCustomField = (item: ApiCustomField): CRMCustomField => {
  const businessValue = item.is_business_value ?? item.isBusinessValue
  return {
    id: String(item.id),
    label: item.label,
    section: item.section,
    customFieldSectionId: item.custom_field_section_id ? String(item.custom_field_section_id) : null,
    formSection: item.form_section || null,
    formSectionOrder: item.form_section_order ?? 0,
    type: item.type,
    required: item.required,
    defaultValue: item.default_value ?? null,
    isBusinessValue: businessValue === true || businessValue === 1 || businessValue === '1' || businessValue === 'true',
    visibleWhen: item.visible_when,
    conditions: (item.conditions || []).map(condition => ({
      ...condition,
      value: Array.isArray(condition.value) ? condition.value.map(String) : [String(condition.value)]
    })),
    options: item.options || [],
    subFields: item.sub_fields || [],
    position: item.position ?? 0
  }
}
