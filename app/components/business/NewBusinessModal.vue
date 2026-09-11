<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
    <div class="my-8 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <header class="flex items-start justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Novo negócio</h2>
          <p class="mt-1 text-xs text-slate-500">O negócio será criado automaticamente na primeira fase do funil.</p>
        </div>
        <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="Fechar" @click="close"><Icon name="mdi:close" size="20" /></button>
      </header>

      <div class="grid border-b border-slate-100 px-6 dark:border-slate-800" :style="{ gridTemplateColumns: `repeat(${wizardSteps.length}, minmax(0, 1fr))` }">
        <div v-for="(item, index) in wizardSteps" :key="item.key" class="flex min-w-0 items-center gap-2 border-b-2 py-3 text-xs font-bold" :class="activeStepIndex === index ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" :class="activeStepIndex === index ? 'bg-indigo-600 text-white' : activeStepIndex > index ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800'">{{ activeStepIndex > index ? '✓' : index + 1 }}</span>
          <span class="truncate">{{ item.label }}</span>
        </div>
      </div>

      <form ref="formElement" class="space-y-6 p-6" @submit.prevent="advanceOrSubmit">
        <section v-if="activeStep.key === 'client'" class="space-y-5">
          <div><h3 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Dados do cliente</h3><p class="mt-1 text-xs text-slate-500">Identificação e contato do cliente.</p></div>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1.5"><span class="text-xs font-bold text-slate-600 dark:text-slate-300">Nome do cliente *</span><input v-model="form.fullname" required class="field-input" /></label>
            <label class="space-y-1.5"><span class="text-xs font-bold text-slate-600 dark:text-slate-300">Tipo de pessoa *</span><select v-model="form.clientType" required class="field-input"><option value="individual">Pessoa física</option><option value="company">Pessoa jurídica</option></select></label>
            <label class="space-y-1.5"><span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ form.clientType === 'company' ? 'CNPJ' : 'CPF' }} *</span><input :value="form.registration" required :maxlength="form.clientType === 'company' ? 18 : 14" inputmode="numeric" class="field-input" @input="updateRegistration" /></label>
            <label class="space-y-1.5"><span class="text-xs font-bold text-slate-600 dark:text-slate-300">Telefone</span><input :value="form.phone" maxlength="15" inputmode="tel" class="field-input" @input="updatePhone" /></label>
            <label class="space-y-1.5"><span class="text-xs font-bold text-slate-600 dark:text-slate-300">Origem do lead</span><select v-model="form.leadSourceId" class="field-input"><option value="">Não informada</option><option v-for="source in leadSources" :key="source.id" :value="String(source.id)">{{ source.name }}</option></select></label>
            <label v-if="canAssignOwner" class="space-y-1.5">
              <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Responsável pelo negócio *</span>
              <select v-model="form.userId" required :disabled="!assignableUsers.length" class="field-input">
                <option value="" disabled>Selecione um responsável</option>
                <option v-for="owner in assignableUsers" :key="owner.id" :value="String(owner.id)">
                  {{ owner.name }}{{ String(owner.id) === String(user?.id) ? ' (você)' : '' }}
                </option>
              </select>
            </label>
          </div>
          <p v-if="!assignableUsers.length" class="text-sm text-amber-700 dark:text-amber-300">Nenhum responsável disponível para este funil.</p>
        </section>

        <section v-else-if="activeStep.kind === 'client-section'" class="space-y-5">
          <div><h3 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{{ activeStep.label }}</h3></div>
          <div class="grid gap-4 sm:grid-cols-2">
            <BusinessCustomFieldInput v-for="field in activeStep.fields" :key="field.id" v-model="customValues[field.id]" :field="field" :class="wideField(field) ? 'sm:col-span-2' : ''" />
          </div>
        </section>

        <section v-else class="space-y-6">
          <section class="space-y-5">
            <div><h3 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Produto</h3><p class="mt-1 text-xs text-slate-500">Classificação e produto relacionado ao negócio.</p></div>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="space-y-1.5"><span class="text-xs font-bold text-slate-600 dark:text-slate-300">Categoria *</span><select v-model="form.categoryId" required :disabled="!form.funnelId" class="field-input"><option value="" disabled>Selecione</option><option v-for="category in availableCategories" :key="category.id" :value="String(category.id)">{{ category.name }}</option></select></label>
              <label class="space-y-1.5"><span class="text-xs font-bold text-slate-600 dark:text-slate-300">Produto <span class="font-normal text-slate-400">(opcional)</span></span><select v-model="form.productId" :disabled="!form.categoryId" class="field-input"><option value="">Definir posteriormente</option><option v-for="product in availableProducts" :key="product.id" :value="String(product.id)">{{ product.name }}</option></select></label>
            </div>
          </section>
          <div v-if="productFieldSections.length" class="space-y-5 border-t border-slate-100 pt-5 dark:border-slate-800">
            <section v-for="section in productFieldSections" :key="section.title" class="space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{{ section.title }}</h4>
              <div class="grid gap-4 sm:grid-cols-2">
                <BusinessCustomFieldInput v-for="field in section.fields" :key="field.id" v-model="customValues[field.id]" :field="field" :class="wideField(field) ? 'sm:col-span-2' : ''" />
              </div>
            </section>
          </div>
          <section class="space-y-5 border-t border-slate-100 pt-5 dark:border-slate-800">
            <div><h3 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Dados do negócio</h3><p class="mt-1 text-xs text-slate-500">Informações comerciais, valores e observações.</p></div>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1.5 sm:col-span-2"><span class="text-xs font-bold text-slate-600 dark:text-slate-300">Observações</span><textarea v-model="form.notes" rows="3" class="field-input" /></label>
            <label class="space-y-1.5 sm:col-span-2"><span class="text-xs font-bold text-slate-600 dark:text-slate-300">Valor do negócio</span><input :value="businessValueDisplay" :disabled="configuredBusinessValue !== null" inputmode="numeric" class="field-input disabled:bg-slate-100 disabled:text-slate-500 dark:disabled:bg-slate-800" @input="updateValue" /><span v-if="configuredBusinessValue !== null" class="text-[11px] text-slate-400">Preenchido automaticamente pelo campo monetário configurado.</span></label>
          </div>
          </section>
          <div v-if="businessFieldSections.length" class="space-y-5 border-t border-slate-100 pt-5 dark:border-slate-800">
            <section v-for="section in businessFieldSections" :key="section.title" class="space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{{ section.title }}</h4>
              <div class="grid gap-4 sm:grid-cols-2">
                <BusinessCustomFieldInput v-for="field in section.fields" :key="field.id" v-model="customValues[field.id]" :field="field" :class="wideField(field) ? 'sm:col-span-2' : ''" />
              </div>
            </section>
          </div>
        </section>

        <footer class="flex items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button v-if="activeStepIndex > 0" type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 dark:border-slate-800 dark:text-slate-300" @click="activeStepIndex--"><Icon name="mdi:arrow-left" class="mr-1" />Voltar</button>
          <span v-else />
          <div class="flex gap-3">
            <button type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 dark:border-slate-800 dark:text-slate-300" @click="close">Cancelar</button>
            <button type="submit" :disabled="saving || (isLastStep && !canSubmit)" class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-50">
              <Icon v-if="saving" name="mdi:loading" class="animate-spin" />{{ saving ? 'Criando...' : isLastStep ? 'Criar negócio' : 'Continuar' }}<Icon v-if="!saving && !isLastStep" name="mdi:arrow-right" />
            </button>
          </div>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CRMCustomField, CRMCustomFieldType } from '~/types/crm'

const props = defineProps<{ open: boolean, initialFunnelId?: string }>()
const emit = defineEmits<{ close: [], created: [] }>()
const { request } = useApi()
const { user } = useAuth()
const { funnels } = useFunnels()
const { customFields } = useCustomFields()
const { customFieldSections } = useCrmSettings()
const { categories } = useCategories()
const { products } = useProducts()
const { leadSources, loadLeadSources } = useLeadSources()
const { users, loadUsers } = useUsers()
const { refreshDeals } = useKanbanData()
const toast = useToast()
const saving = ref(false)
const activeStepIndex = ref(0)
const formElement = ref<HTMLFormElement | null>(null)
const customValues = reactive<Record<string, unknown>>({})
const form = reactive({ fullname: '', clientType: 'individual', registration: '', phone: '', value: '', leadSourceId: '', notes: '', funnelId: '', categoryId: '', productId: '', userId: '' })

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
const updateRegistration = (event: Event) => { form.registration = form.clientType === 'company' ? maskCnpj((event.target as HTMLInputElement).value) : maskCpf((event.target as HTMLInputElement).value) }
const updatePhone = (event: Event) => { form.phone = maskPhone((event.target as HTMLInputElement).value) }
const updateValue = (event: Event) => { if (configuredBusinessValue.value === null) form.value = currencyMask((event.target as HTMLInputElement).value) }

const activeFunnels = computed(() => funnels.value.filter(item => item.active !== false && item.stages.length))
const isAdministrator = computed(() => ['admin', 'master', 'mastr'].includes(String(user.value?.role || '').toLowerCase()))
const isAdministrativeRole = (role: string) => ['admin', 'master', 'mastr'].includes(role.toLowerCase())
const supervisedSellers = computed(() => users.value.filter(item =>
  item.role.toLowerCase() === 'seller' && String(item.supervisorId) === String(user.value?.id)
))
const assignableUsers = computed(() => {
  if (!user.value || !form.funnelId) return []
  const allowed = isAdministrator.value
    ? users.value
    : supervisedSellers.value
  const currentUser = users.value.find(item => String(item.id) === String(user.value?.id)) || {
    id: Number(user.value.id), name: user.value.name, email: '', role: user.value.role,
    teamId: null, funnelId: user.value.funnelId ?? null, supervisorId: null
  }
  return [currentUser, ...allowed.filter(item => String(item.id) !== String(currentUser.id))]
    .filter(item => isAdministrativeRole(item.role) || (item.funnelId != null && String(item.funnelId) === form.funnelId))
})
const canAssignOwner = computed(() => isAdministrator.value || supervisedSellers.value.length > 0)
const availableCategories = computed(() => categories.value.filter(item => item.active && item.funnelIds.includes(form.funnelId)))
const availableProducts = computed(() => products.value.filter(item => item.funnelIds.includes(form.funnelId) && item.categoryIds.includes(Number(form.categoryId))))
const conditionMatches = (field: CRMCustomField) => field.conditions.every(condition => {
  const selected = condition.field === 'funnel_id' ? form.funnelId : condition.field === 'category_id' ? form.categoryId : form.productId
  const included = condition.value.includes(selected)
  return condition.operator === 'equals' ? included : !included
})
const visibleFields = computed(() => customFields.value.filter(field => ['business', 'client', 'product'].includes(field.section) && conditionMatches(field)))
const businessFields = computed(() => visibleFields.value.filter(field => field.section === 'business'))
const clientFields = computed(() => visibleFields.value.filter(field => field.section === 'client'))
const productFields = computed(() => visibleFields.value.filter(field => field.section === 'product'))
const dealCustomDataFields = computed(() => [...productFields.value, ...businessFields.value])
const defaultFormSection = (section: CRMCustomField['section']) => section === 'client' ? 'Dados complementares do cliente' : section === 'product' ? 'Dados complementares do produto' : 'Dados complementares do negócio'
const groupFieldsByFormSection = (fields: CRMCustomField[]) => {
  const sections = new Map<string, { title: string, order: number, fields: CRMCustomField[] }>()
  fields.forEach(field => {
    const configuredSection = customFieldSections.value.find(section => section.id === field.customFieldSectionId)
    const title = configuredSection?.name || field.formSection || defaultFormSection(field.section)
    const section = sections.get(title) || { title, order: field.formSectionOrder, fields: [] }
    section.order = Math.min(section.order, configuredSection?.position ?? field.formSectionOrder)
    section.fields.push(field)
    sections.set(title, section)
  })
  return [...sections.values()]
    .map(section => ({ ...section, fields: [...section.fields].sort((a, b) => a.position - b.position || a.label.localeCompare(b.label)) }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}
const businessFieldSections = computed(() => groupFieldsByFormSection(businessFields.value))
const clientFieldSections = computed(() => groupFieldsByFormSection(clientFields.value))
const productFieldSections = computed(() => groupFieldsByFormSection(productFields.value))
const wizardSteps = computed(() => [
  { key: 'client', kind: 'client', label: 'Cliente', fields: [] as CRMCustomField[] },
  ...clientFieldSections.value.map(section => ({ key: `client-section-${section.title}`, kind: 'client-section', label: section.title, fields: section.fields })),
  { key: 'deal', kind: 'deal', label: 'Produto e negócio', fields: [] as CRMCustomField[] }
])
const activeStep = computed(() => wizardSteps.value[Math.min(activeStepIndex.value, wizardSteps.value.length - 1)] || wizardSteps.value[0])
const isLastStep = computed(() => activeStepIndex.value === wizardSteps.value.length - 1)
const configuredBusinessValue = computed(() => {
  const field = visibleFields.value.find(item => item.type === 'currency' && item.isBusinessValue)
  if (!field) return null
  return parseCurrency(customValues[field.id])
})
const businessValueDisplay = computed(() => configuredBusinessValue.value === null ? form.value : currencyMask(String(Math.round(configuredBusinessValue.value * 100))))
const wideField = (field: CRMCustomField) => ['textarea', 'file', 'group'].includes(field.type)
const selectedStageId = computed(() => activeFunnels.value.find(item => item.id === form.funnelId)?.stages[0]?.id)
const selectedOwnerIsAllowed = computed(() => assignableUsers.value.some(item => String(item.id) === form.userId))
const canSubmit = computed(() => Boolean(form.fullname.trim() && form.registration.trim() && form.funnelId && form.categoryId && selectedStageId.value && user.value?.id && selectedOwnerIsAllowed.value))

watch(() => props.open, value => {
  if (!value) return
  form.funnelId = props.initialFunnelId || activeFunnels.value[0]?.id || ''
  form.userId = String(user.value?.id || '')
  void Promise.all([loadLeadSources(), loadUsers()])
}, { immediate: true })
watch(() => form.funnelId, () => { form.categoryId = ''; form.productId = '' })
watch(assignableUsers, owners => {
  if (owners.some(owner => String(owner.id) === form.userId)) return
  const currentOwner = owners.find(owner => String(owner.id) === String(user.value?.id))
  form.userId = currentOwner ? String(currentOwner.id) : ''
}, { immediate: true })
watch(() => form.categoryId, () => { form.productId = '' })
watch(() => form.clientType, () => { form.registration = '' })
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

/** Builds a plain JSON object containing only fields currently applicable to the deal. */
const serializeCustomFields = (fields: CRMCustomField[]) => Object.fromEntries(fields.map(field => {
  const value = customValues[field.id]
  if (field.type !== 'group') return [field.id, normalizeCustomValue(field.type, value)]

  const rows = (Array.isArray(value) ? value : []).map(row => Object.fromEntries(
    field.subFields.map(subField => [subField.key, normalizeCustomValue(subField.type, row[subField.key])])
  ))
  return [field.id, rows]
}))

const reset = () => {
  activeStepIndex.value = 0
  Object.assign(form, { fullname: '', clientType: 'individual', registration: '', phone: '', value: '', leadSourceId: '', notes: '', funnelId: '', categoryId: '', productId: '', userId: String(user.value?.id || '') })
  Object.keys(customValues).forEach(key => delete customValues[key])
}
const close = () => { if (!saving.value) { reset(); emit('close') } }
const advanceOrSubmit = () => {
  if (!isLastStep.value) {
    if (formElement.value?.reportValidity()) activeStepIndex.value++
    return
  }
  void submit()
}
const submit = async () => {
  if (!canSubmit.value) return
  saving.value = true
  try {
    const client = await request<{ data: { id: number } }>('/clients/resolve', { method: 'POST', body: {
      fullname: form.fullname.trim(), type: form.clientType, registration: onlyDigits(form.registration),
      phones: form.phone.trim() ? [{ number: onlyDigits(form.phone), whatsapp: false }] : []
    } })
    if (clientFields.value.length) {
      await request(`/clients/${client.data.id}`, { method: 'PATCH', body: {
        extra: { custom_fields: serializeCustomFields(clientFields.value) }
      } })
    }
    await request('/businesses', { method: 'POST', body: {
      client_id: client.data.id, user_id: Number(form.userId), category_id: Number(form.categoryId),
      product_id: form.productId ? Number(form.productId) : null, funnel_id: Number(form.funnelId), stage_id: Number(selectedStageId.value),
      lead_source_id: form.leadSourceId ? Number(form.leadSourceId) : null,
      value: configuredBusinessValue.value ?? parseCurrency(form.value), notes: form.notes.trim() || null,
      custom_data: { custom_fields: serializeCustomFields(dealCustomDataFields.value) }
    } })
    await refreshDeals()
    toast.success('Negócio criado na primeira fase do funil.')
    reset(); emit('created'); emit('close')
  } catch {
    // Request errors are displayed globally by useApi.
  } finally { saving.value = false }
}
</script>

<style scoped>
.field-input { @apply block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-950; }
</style>
