<template>
  <div v-if="open && deal" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
    <div class="my-8 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <header class="flex items-start justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Editar negócio</h2>
          <p class="mt-1 text-xs text-slate-500">Atualize os dados cadastrais, comerciais e campos da ficha.</p>
        </div>
        <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="Fechar" @click="close">
          <Icon name="mdi:close" size="20" />
        </button>
      </header>

      <form class="space-y-6 p-6" @submit.prevent="submit">
        <section class="space-y-4">
          <div><h3 class="section-title">Dados do cliente</h3></div>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1.5"><span class="field-label">Nome do cliente *</span><input v-model="form.fullname" required class="field-input" /></label>
            <label class="space-y-1.5"><span class="field-label">Tipo de pessoa *</span><select v-model="form.clientType" required class="field-input"><option value="individual">Pessoa física</option><option value="company">Pessoa jurídica</option></select></label>
            <label class="space-y-1.5"><span class="field-label">{{ form.clientType === 'company' ? 'CNPJ' : 'CPF' }} *</span><input :value="form.registration" required :maxlength="form.clientType === 'company' ? 18 : 14" inputmode="numeric" class="field-input" @input="updateRegistration" /></label>
          </div>
        </section>

        <section v-for="section in clientFieldSections" :key="section.title" class="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <h3 class="section-title">{{ section.title }}</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <BusinessCustomFieldInput v-for="field in section.fields" :key="field.id" v-model="customValues[field.id]" :field="field" :class="wideField(field) ? 'sm:col-span-2' : ''" />
          </div>
        </section>

        <section class="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <div><h3 class="section-title">Produto</h3></div>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1.5"><span class="field-label">Categoria *</span><select v-model="form.categoryId" required class="field-input"><option value="" disabled>Selecione</option><option v-for="category in availableCategories" :key="category.id" :value="String(category.id)">{{ category.name }}</option></select></label>
            <label class="space-y-1.5"><span class="field-label">Produto <span class="font-normal text-slate-400">(opcional)</span></span><select v-model="form.productId" :disabled="!form.categoryId" class="field-input"><option value="">Definir posteriormente</option><option v-for="product in availableProducts" :key="product.id" :value="String(product.id)">{{ product.name }}</option></select></label>
          </div>
        </section>

        <section v-for="section in productFieldSections" :key="section.title" class="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <h3 class="section-title">{{ section.title }}</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <BusinessCustomFieldInput v-for="field in section.fields" :key="field.id" v-model="customValues[field.id]" :field="field" :class="wideField(field) ? 'sm:col-span-2' : ''" />
          </div>
        </section>

        <section class="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <div><h3 class="section-title">Dados do negócio</h3></div>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1.5 sm:col-span-2"><span class="field-label">Observações</span><textarea v-model="form.notes" rows="3" class="field-input" /></label>
            <label class="space-y-1.5 sm:col-span-2"><span class="field-label">Valor do negócio</span><input :value="businessValueDisplay" :disabled="configuredBusinessValue !== null" inputmode="numeric" class="field-input disabled:bg-slate-100 disabled:text-slate-500 dark:disabled:bg-slate-800" @input="updateValue" /><span v-if="configuredBusinessValue !== null" class="text-[11px] text-slate-400">Preenchido automaticamente pelo campo monetário configurado.</span></label>
          </div>
        </section>

        <section v-for="section in businessFieldSections" :key="section.title" class="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <h3 class="section-title">{{ section.title }}</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <BusinessCustomFieldInput v-for="field in section.fields" :key="field.id" v-model="customValues[field.id]" :field="field" :class="wideField(field) ? 'sm:col-span-2' : ''" />
          </div>
        </section>

        <footer class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
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
import type { DealCard, CRMCustomField, CRMCustomFieldType } from '~/types/crm'

const props = defineProps<{ open: boolean, deal: DealCard | null }>()
const emit = defineEmits<{ close: [], saved: [] }>()
const { request } = useApi()
const { categories } = useCategories()
const { products } = useProducts()
const { customFields } = useCustomFields()
const { customFieldSections } = useCrmSettings()
const { refreshDeals } = useKanbanData()
const toast = useToast()
const saving = ref(false)
const hydrating = ref(false)
const customValues = reactive<Record<string, unknown>>({})
const form = reactive({ fullname: '', clientType: 'individual' as DealCard['clientType'], registration: '', value: '', notes: '', categoryId: '', productId: '' })

const onlyDigits = (value: string) => value.replace(/\D/g, '')
const maskCpf = (value: string) => onlyDigits(value).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
const maskCnpj = (value: string) => onlyDigits(value).slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2')
const currencyMask = (value: string) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(onlyDigits(value)) / 100)
const parseCurrency = (value: unknown) => Number(String(value || '').replace(/[^\d,-]/g, '').replace(/\./g, '').replace(',', '.')) || 0
const updateRegistration = (event: Event) => { form.registration = form.clientType === 'company' ? maskCnpj((event.target as HTMLInputElement).value) : maskCpf((event.target as HTMLInputElement).value) }
const updateValue = (event: Event) => { if (configuredBusinessValue.value === null) form.value = currencyMask((event.target as HTMLInputElement).value) }
const availableCategories = computed(() => categories.value.filter(item => item.active && item.funnelIds.includes(String(props.deal?.funnelId || ''))))
const availableProducts = computed(() => products.value.filter(item => item.funnelIds.includes(String(props.deal?.funnelId || '')) && item.categoryIds.includes(Number(form.categoryId))))
const conditionMatches = (field: CRMCustomField) => field.conditions.every(condition => {
  const selected = condition.field === 'funnel_id' ? String(props.deal?.funnelId || '') : condition.field === 'category_id' ? form.categoryId : form.productId
  const included = condition.value.includes(selected)
  return condition.operator === 'equals' ? included : !included
})
const visibleFields = computed(() => customFields.value.filter(field => ['business', 'client', 'product'].includes(field.section) && conditionMatches(field)))
const clientFields = computed(() => visibleFields.value.filter(field => field.section === 'client'))
const productFields = computed(() => visibleFields.value.filter(field => field.section === 'product'))
const businessFields = computed(() => visibleFields.value.filter(field => field.section === 'business'))
const dealCustomDataFields = computed(() => [...productFields.value, ...businessFields.value])
const defaultFormSection = (section: CRMCustomField['section']) => section === 'client' ? 'Dados complementares do cliente' : section === 'product' ? 'Dados complementares do produto' : 'Dados complementares do negócio'
const groupFieldsByFormSection = (fields: CRMCustomField[]) => {
  const sections = new Map<string, { title: string, order: number, fields: CRMCustomField[] }>()
  fields.forEach(field => {
    const configuredSection = customFieldSections.value.find(section => section.id === field.customFieldSectionId)
    const title = configuredSection?.name || field.formSection || defaultFormSection(field.section)
    const section = sections.get(title) || { title, order: configuredSection?.position ?? field.formSectionOrder, fields: [] }
    section.order = Math.min(section.order, configuredSection?.position ?? field.formSectionOrder)
    section.fields.push(field)
    sections.set(title, section)
  })
  return [...sections.values()]
    .map(section => ({ ...section, fields: [...section.fields].sort((a, b) => a.position - b.position || a.label.localeCompare(b.label)) }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}
const clientFieldSections = computed(() => groupFieldsByFormSection(clientFields.value))
const productFieldSections = computed(() => groupFieldsByFormSection(productFields.value))
const businessFieldSections = computed(() => groupFieldsByFormSection(businessFields.value))
const configuredBusinessValue = computed(() => {
  const field = visibleFields.value.find(item => item.type === 'currency' && item.isBusinessValue)
  return field ? parseCurrency(customValues[field.id]) : null
})
const businessValueDisplay = computed(() => configuredBusinessValue.value === null ? form.value : currencyMask(String(Math.round(configuredBusinessValue.value * 100))))
const wideField = (field: CRMCustomField) => ['textarea', 'file', 'group'].includes(field.type)
const canSubmit = computed(() => Boolean(props.deal && form.fullname.trim() && form.registration.trim() && form.categoryId))

watch(() => props.open, value => {
  if (!value || !props.deal) return
  hydrating.value = true
  Object.assign(form, {
    fullname: props.deal.title,
    clientType: props.deal.clientType,
    registration: props.deal.clientType === 'company' ? maskCnpj(props.deal.document) : maskCpf(props.deal.document),
    value: currencyMask(String(Math.round(props.deal.value * 100))),
    notes: props.deal.notes || '',
    categoryId: String(props.deal.categoryId),
    productId: props.deal.productId ? String(props.deal.productId) : ''
  })
  Object.keys(customValues).forEach(key => delete customValues[key])
  Object.assign(customValues, props.deal.clientCustomFields, props.deal.customFields)
  nextTick(() => { hydrating.value = false })
}, { immediate: true })

watch(() => form.clientType, () => { if (!hydrating.value) form.registration = '' })
watch(() => form.categoryId, () => { if (!hydrating.value) form.productId = '' })
watch(visibleFields, fields => {
  const visibleIds = new Set(fields.map(field => field.id))
  Object.keys(customValues).forEach(id => { if (!visibleIds.has(id)) delete customValues[id] })
  fields.forEach(field => {
    if (customValues[field.id] !== undefined) return
    customValues[field.id] = field.type === 'checkbox' ? field.defaultValue ?? false : field.type === 'group' ? [] : ''
  })
}, { immediate: true })

const normalizeCustomValue = (type: CRMCustomFieldType, value: unknown): unknown => {
  if (type === 'number' || type === 'currency') {
    if (value === '' || value == null) return null
    const number = type === 'currency' ? parseCurrency(value) : Number(value)
    return Number.isFinite(number) ? number : null
  }
  if (type === 'checkbox') return Boolean(value)
  return value
}
const serializeCustomFields = (fields: CRMCustomField[]) => Object.fromEntries(fields.map(field => {
  const value = customValues[field.id]
  if (field.type !== 'group') return [field.id, normalizeCustomValue(field.type, value)]
  const rows = (Array.isArray(value) ? value : []).map(row => Object.fromEntries(
    field.subFields.map(subField => [subField.key, normalizeCustomValue(subField.type, row[subField.key])])
  ))
  return [field.id, rows]
}))
const close = () => { if (!saving.value) emit('close') }
const submit = async () => {
  if (!props.deal || !canSubmit.value) return
  saving.value = true
  try {
    await request(`/clients/${props.deal.clientId}`, { method: 'PATCH', body: {
      fullname: form.fullname.trim(),
      type: form.clientType,
      registration: onlyDigits(form.registration),
      extra: { custom_fields: serializeCustomFields(clientFields.value) }
    } })
    await request(`/businesses/${props.deal.id}`, { method: 'PATCH', body: {
      category_id: Number(form.categoryId),
      product_id: form.productId ? Number(form.productId) : null,
      value: configuredBusinessValue.value ?? parseCurrency(form.value),
      notes: form.notes.trim() || null,
      custom_data: { custom_fields: serializeCustomFields(dealCustomDataFields.value) }
    } })
    await refreshDeals()
    toast.success('Negócio atualizado com sucesso.')
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
