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

/** Normalize Laravel's custom_data envelope into its field-ID/value map. */
export const extractCustomFields = (data: unknown): Record<string, unknown> => {
  if (typeof data === 'string') {
    try { return extractCustomFields(JSON.parse(data)) } catch { return {} }
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
