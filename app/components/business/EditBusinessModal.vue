<template>
  <div v-if="open && deal && editTarget" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
    <div class="my-8 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <header class="flex items-start justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">{{ modalTitle }}</h2>
          <p class="mt-1 text-xs text-slate-500">{{ modalDescription }}</p>
        </div>
        <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="Fechar" @click="close">
          <Icon name="mdi:close" size="20" />
        </button>
      </header>

      <form ref="formElement" class="space-y-6 p-6" @submit.prevent="submit">
        <section v-if="editTarget.type === 'client-core'" class="space-y-5">
          <h3 class="section-title">Dados do cliente</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1.5"><span class="field-label">Nome do cliente *</span><input v-model="form.fullname" required class="field-input" /></label>
            <label class="space-y-1.5"><span class="field-label">Tipo de pessoa *</span><select v-model="form.clientType" required class="field-input"><option value="individual">Pessoa física</option><option value="company">Pessoa jurídica</option></select></label>
            <label class="space-y-1.5"><span class="field-label">{{ form.clientType === 'company' ? 'CNPJ' : 'CPF' }} *</span><input :value="form.registration" required :maxlength="form.clientType === 'company' ? 18 : 14" inputmode="numeric" class="field-input" @input="updateRegistration" /></label>
            <label class="space-y-1.5"><span class="field-label">Telefone</span><input :value="form.phone" maxlength="15" inputmode="tel" class="field-input" @input="updatePhone" /></label>
            <label class="space-y-1.5"><span class="field-label">Origem do lead</span><select v-model="form.leadSourceId" class="field-input"><option value="">Não informada</option><option v-for="source in leadSources" :key="source.id" :value="String(source.id)">{{ source.name }}</option></select></label>
          </div>
        </section>

        <section v-else-if="editTarget.type === 'deal-core'" class="space-y-5">
          <h3 class="section-title">Produto e negócio</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1.5"><span class="field-label">Categoria *</span><select v-model="form.categoryId" required class="field-input"><option value="" disabled>Selecione</option><option v-for="category in availableCategories" :key="category.id" :value="String(category.id)">{{ category.name }}</option></select></label>
            <label class="space-y-1.5"><span class="field-label">Produto <span class="font-normal text-slate-400">(opcional)</span></span><select v-model="form.productId" :disabled="!form.categoryId" class="field-input"><option value="">Definir posteriormente</option><option v-for="product in availableProducts" :key="product.id" :value="String(product.id)">{{ product.name }}</option></select></label>
            <label class="space-y-1.5 sm:col-span-2"><span class="field-label">Observações</span><textarea v-model="form.notes" rows="3" class="field-input" /></label>
            <label class="space-y-1.5 sm:col-span-2"><span class="field-label">Valor do negócio</span><input :value="businessValueDisplay" :disabled="configuredBusinessValue !== null" inputmode="numeric" class="field-input disabled:bg-slate-100 disabled:text-slate-500 dark:disabled:bg-slate-800" @input="updateValue" /><span v-if="configuredBusinessValue !== null" class="text-[11px] text-slate-400">Preenchido automaticamente pelo campo monetário configurado.</span></label>
          </div>
        </section>

        <section v-else-if="editTarget.type === 'group-row' && groupField" class="space-y-5">
          <h3 class="section-title">{{ groupField.label }}</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <label v-for="subField in groupField.subFields" :key="subField.key" class="block space-y-1.5" :class="['textarea', 'file'].includes(subField.type) ? 'sm:col-span-2' : ''">
              <span class="field-label">{{ subField.label }} <span v-if="subField.required">*</span></span>
              <select v-if="subField.type === 'select'" v-model="groupRow[subField.key]" :required="subField.required" class="field-input"><option value="" disabled>Selecione</option><option v-for="option in subField.options" :key="option" :value="option">{{ option }}</option></select>
              <input v-else-if="subField.type === 'checkbox'" v-model="groupRow[subField.key]" type="checkbox" class="rounded border-slate-300">
              <textarea v-else-if="subField.type === 'textarea'" v-model="groupRow[subField.key]" :required="subField.required" rows="2" class="field-input" />
              <input v-else-if="subField.type === 'currency'" :value="groupRow[subField.key]" :required="subField.required" inputmode="numeric" class="field-input" @input="groupRow[subField.key] = currencyMask(inputValue($event))">
              <input v-else v-model="groupRow[subField.key]" :required="subField.required" :type="inputType(subField.type)" class="field-input">
            </label>
          </div>
        </section>

        <section v-else class="space-y-5">
          <h3 class="section-title">{{ editTarget.title || 'Campos' }}</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <BusinessCustomFieldInput v-for="field in targetFields" :key="field.id" v-model="customValues[field.id]" :field="field" :class="wideField(field) ? 'sm:col-span-2' : ''" />
          </div>
        </section>

        <footer class="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 dark:border-slate-800 dark:text-slate-300" @click="close">Cancelar</button>
          <button type="submit" :disabled="saving || !canSubmit" class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-50">
            <Icon v-if="saving" name="mdi:loading" class="animate-spin" />{{ saving ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DealCard, CRMCustomField, CRMCustomFieldType, CRMCustomSubFieldType } from '~/types/crm'

export type BusinessEditTarget = {
  type: 'client-core' | 'deal-core' | 'client-custom-section' | 'business-custom-section' | 'group-row'
  title?: string
  fieldIds?: string[]
  groupFieldId?: string
  rowIndex?: number
}

const props = defineProps<{ open: boolean, deal: DealCard | null, target: BusinessEditTarget | null }>()
const emit = defineEmits<{ close: [], saved: [] }>()
const { request } = useApi()
const { categories } = useCategories()
const { products } = useProducts()
const { customFields } = useCustomFields()
const { leadSources, loadLeadSources } = useLeadSources()
const { refreshDeals } = useKanbanData()
const toast = useToast()
const saving = ref(false)
const hydrating = ref(false)
const formElement = ref<HTMLFormElement | null>(null)
const customValues = reactive<Record<string, unknown>>({})
const groupRow = reactive<Record<string, unknown>>({})
const form = reactive({ fullname: '', clientType: 'individual' as DealCard['clientType'], registration: '', phone: '', value: '', leadSourceId: '', notes: '', categoryId: '', productId: '' })

const editTarget = computed(() => props.target)
const onlyDigits = (value: string) => value.replace(/\D/g, '')
const maskCpf = (value: string) => onlyDigits(value).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
const maskCnpj = (value: string) => onlyDigits(value).slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2')
const maskPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 10) return digits.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})/, (_, area, prefix, suffix) => [area && `(${area}`, area.length === 2 ? ') ' : '', prefix, suffix && `-${suffix}`].join(''))
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}
const currencyMask = (value: string) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(onlyDigits(value)) / 100)
const parseCurrency = (value: unknown) => Number(String(value || '').replace(/[^\d,-]/g, '').replace(/\./g, '').replace(',', '.')) || 0
const inputValue = (event: Event) => (event.target as HTMLInputElement).value
const inputType = (type: CRMCustomSubFieldType) => type === 'number' ? 'number' : type === 'date' ? 'date' : type === 'phone' ? 'tel' : 'text'
const updateRegistration = (event: Event) => { form.registration = form.clientType === 'company' ? maskCnpj((event.target as HTMLInputElement).value) : maskCpf((event.target as HTMLInputElement).value) }
const updatePhone = (event: Event) => { form.phone = maskPhone((event.target as HTMLInputElement).value) }
const updateValue = (event: Event) => { if (configuredBusinessValue.value === null) form.value = currencyMask((event.target as HTMLInputElement).value) }

const availableCategories = computed(() => categories.value.filter(item => item.active && item.funnelIds.includes(String(props.deal?.funnelId || ''))))
const availableProducts = computed(() => products.value.filter(item => item.funnelIds.includes(String(props.deal?.funnelId || '')) && item.categoryIds.includes(Number(form.categoryId))))
const targetFields = computed(() => {
  const ids = new Set(editTarget.value?.fieldIds || [])
  return customFields.value
    .filter(field => ids.has(field.id))
    .sort((a, b) => a.position - b.position || a.label.localeCompare(b.label))
})
const groupField = computed(() => customFields.value.find(field => field.id === editTarget.value?.groupFieldId && field.type === 'group'))
const configuredBusinessValue = computed(() => {
  const field = customFields.value.find(item => item.type === 'currency' && item.isBusinessValue)
  return field ? parseCurrency(customValues[field.id]) : null
})
const businessValueDisplay = computed(() => configuredBusinessValue.value === null ? form.value : currencyMask(String(Math.round(configuredBusinessValue.value * 100))))
const wideField = (field: CRMCustomField) => ['textarea', 'file', 'group'].includes(field.type)
const canSubmit = computed(() => {
  if (!props.deal || !editTarget.value) return false
  if (editTarget.value.type === 'client-core') return Boolean(form.fullname.trim() && form.registration.trim())
  if (editTarget.value.type === 'deal-core') return Boolean(form.categoryId)
  return true
})
const modalTitle = computed(() => `Editar ${editTarget.value?.title || 'informações'}`)
const modalDescription = computed(() => editTarget.value?.type === 'group-row'
  ? 'Atualize somente este item da lista.'
  : 'Atualize somente os dados deste card.'
)

const hydrate = () => {
  if (!props.open || !props.deal) return
  hydrating.value = true
  Object.assign(form, {
    fullname: props.deal.title,
    clientType: props.deal.clientType,
    registration: props.deal.clientType === 'company' ? maskCnpj(props.deal.document) : maskCpf(props.deal.document),
    phone: maskPhone(props.deal.phone || ''),
    value: currencyMask(String(Math.round(props.deal.value * 100))),
    leadSourceId: props.deal.leadSourceId ? String(props.deal.leadSourceId) : '',
    notes: props.deal.notes || '',
    categoryId: String(props.deal.categoryId),
    productId: props.deal.productId ? String(props.deal.productId) : ''
  })
  Object.keys(customValues).forEach(key => delete customValues[key])
  Object.assign(customValues, props.deal.clientCustomFields, props.deal.customFields)
  Object.keys(groupRow).forEach(key => delete groupRow[key])
  if (editTarget.value?.type === 'group-row' && groupField.value) {
    const rows = props.deal.customFields[groupField.value.id]
    const row = Array.isArray(rows) ? rows[editTarget.value.rowIndex ?? -1] : null
    Object.assign(groupRow, row && typeof row === 'object' ? row : {})
  }
  void loadLeadSources()
  nextTick(() => { hydrating.value = false })
}

watch([() => props.open, () => props.deal, editTarget, groupField], hydrate, { immediate: true })
watch(() => form.clientType, () => { if (!hydrating.value) form.registration = '' })
watch(() => form.categoryId, () => { if (!hydrating.value) form.productId = '' })

const normalizeCustomValue = (type: CRMCustomFieldType, value: unknown): unknown => {
  if (type === 'number' || type === 'currency') {
    if (value === '' || value == null) return null
    const number = type === 'currency' ? parseCurrency(value) : Number(value)
    return Number.isFinite(number) ? number : null
  }
  if (type === 'checkbox') return Boolean(value)
  return value
}
const serializeCustomFieldValues = (source: Record<string, unknown>, fields: CRMCustomField[]) => Object.fromEntries(fields.map(field => {
  const value = source[field.id]
  if (field.type !== 'group') return [field.id, normalizeCustomValue(field.type, value)]
  const rows = (Array.isArray(value) ? value : []).map(row => Object.fromEntries(
    field.subFields.map(subField => [subField.key, normalizeCustomValue(subField.type, row[subField.key])])
  ))
  return [field.id, rows]
}))
const buildClientCustomFields = () => ({ ...props.deal?.clientCustomFields, ...serializeCustomFieldValues(customValues, targetFields.value) })
const buildBusinessCustomFields = () => ({ ...props.deal?.customFields, ...serializeCustomFieldValues(customValues, targetFields.value) })
const buildGroupRows = () => {
  if (!props.deal || !groupField.value) return []
  const rows = Array.isArray(props.deal.customFields[groupField.value.id]) ? [...props.deal.customFields[groupField.value.id] as Array<Record<string, unknown>>] : []
  const index = editTarget.value?.rowIndex ?? -1
  if (index < 0) return rows
  rows[index] = Object.fromEntries(groupField.value.subFields.map(subField => [subField.key, normalizeCustomValue(subField.type, groupRow[subField.key])]))
  return rows
}
const close = () => { if (!saving.value) emit('close') }
const submit = async () => {
  if (!props.deal || !editTarget.value || !canSubmit.value || !formElement.value?.reportValidity()) return
  saving.value = true
  try {
    if (editTarget.value.type === 'client-core') {
      await request(`/clients/${props.deal.clientId}`, { method: 'PATCH', body: {
        fullname: form.fullname.trim(),
        type: form.clientType,
        registration: onlyDigits(form.registration),
        phones: form.phone.trim() ? [{ number: onlyDigits(form.phone), whatsapp: false }] : [],
        extra: { custom_fields: props.deal.clientCustomFields }
      } })
      await request(`/businesses/${props.deal.id}`, { method: 'PATCH', body: { lead_source_id: form.leadSourceId ? Number(form.leadSourceId) : null } })
    } else if (editTarget.value.type === 'deal-core') {
      await request(`/businesses/${props.deal.id}`, { method: 'PATCH', body: {
        category_id: Number(form.categoryId),
        product_id: form.productId ? Number(form.productId) : null,
        value: configuredBusinessValue.value ?? parseCurrency(form.value),
        notes: form.notes.trim() || null,
        custom_data: { custom_fields: props.deal.customFields }
      } })
    } else if (editTarget.value.type === 'client-custom-section') {
      await request(`/clients/${props.deal.clientId}`, { method: 'PATCH', body: { extra: { custom_fields: buildClientCustomFields() } } })
    } else if (editTarget.value.type === 'group-row' && groupField.value) {
      await request(`/businesses/${props.deal.id}`, { method: 'PATCH', body: { custom_data: { custom_fields: { ...props.deal.customFields, [groupField.value.id]: buildGroupRows() } } } })
    } else {
      await request(`/businesses/${props.deal.id}`, { method: 'PATCH', body: { custom_data: { custom_fields: buildBusinessCustomFields() } } })
    }
    await refreshDeals({ funnelId: props.deal.funnelId, stageIds: props.deal.funnelStageId ? [props.deal.funnelStageId] : [] })
    toast.success('Informações atualizadas.')
    emit('saved')
    emit('close')
  } catch {
    // Request errors are displayed globally by useApi.
  } finally { saving.value = false }
}
</script>

<style scoped>
.field-input { @apply block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-950; }
.field-label { @apply text-xs font-bold text-slate-600 dark:text-slate-300; }
.section-title { @apply text-xs font-bold uppercase tracking-[0.16em] text-slate-400; }
</style>
