export const hasCustomFieldValue = (value: unknown): boolean => {
  if (value == null) return false
  if (typeof value === 'string') return value.trim() !== ''
  if (Array.isArray(value)) return value.some(hasCustomFieldValue)
  return true
}

export const formatCustomFieldValue = (type: string, value: unknown): string => {
  if (!hasCustomFieldValue(value)) return ''
  if (type === 'checkbox') {
    if ([false, 0, '0', 'false'].includes(value as string | number | boolean)) return 'Não'
    if ([true, 1, '1', 'true'].includes(value as string | number | boolean)) return 'Sim'
    return String(value)
  }
  if (type === 'currency' || type === 'number') {
    const raw = typeof value === 'string' ? value.replace(/R\$/g, '').replace(/\s/g, '') : value
    const normalized = typeof raw === 'string' && raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw
    const number = Number(normalized)
    if (!Number.isFinite(number)) return String(value)
    return new Intl.NumberFormat('pt-BR', type === 'currency'
      ? { style: 'currency', currency: 'BRL' }
      : { maximumFractionDigits: 20 }).format(number)
  }
  if (type === 'date') {
    const raw = String(value)
    // Date-only fields represent a calendar day, not midnight UTC.
    const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw + 'T12:00:00' : raw)
    return Number.isNaN(date.getTime()) ? raw : new Intl.DateTimeFormat('pt-BR').format(date)
  }
  if (Array.isArray(value)) return value.filter(hasCustomFieldValue).map(String).join(', ')
  return String(value)
}

const customFieldIdKeys = ['custom_field_id', 'customFieldId', 'field_id', 'fieldId', 'key', 'id']
const customFieldValueKeys = ['value', 'field_value', 'fieldValue', 'answer', 'content', 'valor']

const extractCustomFieldId = (record: Record<string, unknown>) => {
  for (const key of customFieldIdKeys) {
    const value = record[key]
    if (value == null || value === '') continue
    return String(value)
  }

  const field = record.field || record.custom_field || record.customField
  if (field && typeof field === 'object' && !Array.isArray(field)) {
    return extractCustomFieldId(field as Record<string, unknown>)
  }

  return null
}

const extractCustomFieldValue = (record: Record<string, unknown>) => {
  for (const key of customFieldValueKeys) {
    if (key in record) return record[key]
  }

  const { custom_field_id, customFieldId, field_id, fieldId, key, id, field, custom_field, customField, ...value } = record
  return Object.keys(value).length === 1 && 'label' in value ? null : value
}

/** Normalize Laravel's custom_data envelope into its field-ID/value map. */
export const extractCustomFields = (data: unknown): Record<string, unknown> => {
  if (typeof data === 'string') {
    try { return extractCustomFields(JSON.parse(data)) } catch { return {} }
  }
  if (Array.isArray(data)) {
    return data.reduce<Record<string, unknown>>((fields, item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return fields
      const record = item as Record<string, unknown>
      const id = extractCustomFieldId(record)
      if (!id) return fields
      fields[id] = extractCustomFieldValue(record)
      return fields
    }, {})
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
  const record = data as Record<string, unknown>
  if ('custom_fields' in record) return extractCustomFields(record.custom_fields)
  if ('customFields' in record) return extractCustomFields(record.customFields)
  return record
}

export const savedCustomFieldEntries = (
  values: Record<string, unknown>,
  definitions: Array<{ id: string, label: string, type: string }>
) => {
  const byId = new Map(definitions.map(field => [String(field.id), field]))
  return Object.entries(values)
    .filter(([, value]) => hasCustomFieldValue(value))
    .map(([id, value]) => ({
      id,
      label: byId.get(id)?.label || `Campo #${id}`,
      type: byId.get(id)?.type || 'text',
      value
    }))
}
