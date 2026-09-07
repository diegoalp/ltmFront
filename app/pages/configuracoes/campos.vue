<template>
  <div class="settings-page space-y-6">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Construtor de Ficha</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Configure campos por cadastro, opções de seleção e condições de exibição.</p>
      </div>
      <NuxtLink to="/configuracoes" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Icon name="mdi:arrow-left" size="16" />
        Configurações
      </NuxtLink>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-100 p-5 dark:border-slate-800">
          <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Campos configurados</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[760px] text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th class="px-5 py-3">Campo</th>
                <th class="px-5 py-3">Cadastro</th>
                <th class="px-5 py-3">Tipo</th>
                <th class="px-5 py-3">Regra de exibição</th>
                <th class="px-5 py-3">Obrigatório</th>
                <th class="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="field in customFields" :key="field.id">
                <td class="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">
                  {{ field.label }}
                  <span v-if="field.isBusinessValue" class="ml-1 inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Valor do negócio</span>
                </td>
                <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ sectionLabels[field.section] }}</td>
                <td class="px-5 py-4"><span class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ field.type }}</span></td>
                <td class="px-5 py-4 text-slate-500 dark:text-slate-400">{{ conditionSummary(field) }}</td>
                <td class="px-5 py-4">
                  <Icon :name="field.required ? 'mdi:check-circle' : 'mdi:minus-circle-outline'" :class="field.required ? 'text-emerald-500' : 'text-slate-300'" size="20" />
                </td>
                <td class="px-5 py-4">
                  <div class="flex justify-end gap-1">
                    <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950" :aria-label="`Editar ${field.label}`" title="Editar campo" @click="editField(field)"><Icon name="mdi:pencil-outline" size="18" /></button>
                    <button type="button" :disabled="removingId === field.id" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-wait disabled:opacity-50 dark:hover:bg-rose-950" :aria-label="`Remover ${field.label}`" title="Remover campo" @click="deleteField(field)"><Icon :name="removingId === field.id ? 'mdi:loading' : 'mdi:trash-can-outline'" :class="{ 'animate-spin': removingId === field.id }" size="18" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">{{ editingId ? 'Editar campo' : 'Adicionar campo' }}</h2>
          <button v-if="editingId" type="button" class="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200" @click="resetForm">Cancelar</button>
        </div>
        <form class="mt-4 space-y-3" @submit.prevent="saveField">
          <label class="block space-y-1.5"><span class="text-xs font-bold uppercase tracking-wide text-slate-500">Nome do campo</span><input v-model="form.label" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Ex.: Órgão" /></label>
          <label class="block space-y-1.5"><span class="text-xs font-bold uppercase tracking-wide text-slate-500">Cadastro</span><select v-model="form.section" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950"><option value="business">Negócio</option><option value="product">Produto</option><option value="client">Cliente</option></select></label>
          <select v-model="form.type" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950">
            <option value="text">Texto</option>
            <option value="textarea">Texto longo</option>
            <option value="currency">Moeda</option>
            <option value="number">Número</option>
            <option value="date">Data</option>
            <option value="select">Seleção</option>
            <option value="file">Arquivo</option>
            <option value="group">Lista repetível</option>
            <option value="checkbox">Caixa de seleção</option>
          </select>
          <label v-if="form.type === 'checkbox'" class="block space-y-1.5">
            <span class="text-xs font-bold uppercase tracking-wide text-slate-500">Valor padrão</span>
            <select v-model="form.defaultValue" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950">
              <option :value="true">True (marcado)</option>
              <option :value="false">False (desmarcado)</option>
            </select>
          </label>
          <label v-if="form.type === 'currency'" class="flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900 dark:bg-indigo-950/40">
            <input v-model="form.isBusinessValue" type="checkbox" class="mt-0.5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500">
            <span><strong class="block text-sm text-indigo-900 dark:text-indigo-200">Usar como valor do negócio</strong><span class="text-xs text-indigo-700 dark:text-indigo-300">O valor preenchido neste campo também será salvo como o valor principal do negócio.</span></span>
          </label>
          <fieldset v-if="form.type === 'select'" class="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <legend class="px-1 text-xs font-bold uppercase tracking-wide text-slate-500">Opções disponíveis</legend>
            <div v-for="(_, index) in form.options" :key="index" class="flex gap-2"><input v-model="form.options[index]" required class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950" :placeholder="`Opção ${index + 1}`"><button type="button" class="rounded-lg px-2 text-rose-600 hover:bg-rose-50" aria-label="Remover opção" @click="form.options.splice(index, 1)"><Icon name="mdi:close" /></button></div>
            <button type="button" class="text-xs font-bold text-indigo-600" @click="form.options.push('')">+ Adicionar opção</button>
          </fieldset>
          <fieldset v-if="form.type === 'group'" class="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <legend class="px-1 text-xs font-bold uppercase tracking-wide text-slate-500">Subcampos da lista</legend>
            <p class="text-xs text-slate-500">Cada item adicionado à lista será composto por estes campos.</p>
            <div v-for="(subField, index) in form.subFields" :key="subField.key" class="space-y-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
              <div class="flex gap-2">
                <input v-model="subField.label" required class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" :placeholder="`Subcampo ${index + 1}`">
                <button type="button" class="rounded-lg px-2 text-rose-600 hover:bg-rose-50" aria-label="Remover subcampo" @click="removeSubField(index)"><Icon name="mdi:close" /></button>
              </div>
              <select v-model="subField.type" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" @change="subField.options = []">
                <option value="text">Texto</option>
                <option value="textarea">Texto longo</option>
                <option value="currency">Moeda</option>
                <option value="number">Número</option>
                <option value="date">Data</option>
                <option value="select">Seleção</option>
                <option value="file">Arquivo</option>
                <option value="phone">Telefone</option>
                <option value="document">Documento</option>
                <option value="checkbox">Caixa de seleção</option>
              </select>
              <div v-if="subField.type === 'select'" class="space-y-2 rounded-lg border border-slate-200 p-2 dark:border-slate-800">
                <div v-for="(_, optionIndex) in subField.options" :key="optionIndex" class="flex gap-2">
                  <input v-model="subField.options[optionIndex]" required class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" :placeholder="`Opção ${optionIndex + 1}`">
                  <button type="button" class="rounded-lg px-2 text-rose-600" aria-label="Remover opção" @click="subField.options.splice(optionIndex, 1)"><Icon name="mdi:close" /></button>
                </div>
                <button type="button" class="text-xs font-bold text-indigo-600" @click="subField.options.push('')">+ Adicionar opção</button>
              </div>
              <label class="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300"><input v-model="subField.required" type="checkbox" class="rounded border-slate-300"> Obrigatório</label>
            </div>
            <button type="button" class="text-xs font-bold text-indigo-600" @click="addSubField">+ Adicionar subcampo</button>
          </fieldset>
          <fieldset class="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <legend class="px-1 text-xs font-bold uppercase tracking-wide text-slate-500">Condições de exibição</legend>
            <p class="text-xs text-slate-500">Sem condições, o campo será sempre exibido.</p>
            <div v-for="(condition, index) in form.conditions" :key="index" class="space-y-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-950">
              <select v-model="condition.field" class="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" @change="resetConditionValue(condition)"><option value="category_id">Categoria</option><option v-if="form.section === 'business'" value="product_id">Produto</option><option v-if="form.section === 'business'" value="funnel_id">Funil</option></select>
              <div class="flex gap-2">
                <select v-model="condition.operator" class="h-10 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"><option value="equals">é igual a</option><option value="not_equals">é diferente de</option></select>
                <div class="min-w-0 flex-1 space-y-1 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                  <label v-for="option in conditionOptions(condition.field)" :key="option.id" class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                    <input v-model="condition.value" type="checkbox" :value="option.id" class="rounded border-slate-300">
                    <span>{{ option.name }}</span>
                  </label>
                  <p v-if="!conditionOptions(condition.field).length" class="px-2 py-1 text-xs text-slate-500">Nenhuma opção cadastrada.</p>
                </div>
                <button type="button" class="h-10 rounded-lg px-2 text-rose-600" @click="form.conditions.splice(index, 1)"><Icon name="mdi:close" /></button>
              </div>
            </div>
            <button type="button" class="text-xs font-bold text-indigo-600" @click="addCondition">+ Adicionar condição</button>
          </fieldset>
          <label class="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-300">
            <input v-model="form.required" type="checkbox" class="rounded border-slate-300" />
            Campo obrigatório
          </label>
          <button type="submit" :disabled="saving" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900">
            <Icon name="mdi:form-textbox" size="18" />
            {{ saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Adicionar campo' }}
          </button>
        </form>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CRMCustomField, CRMCustomFieldCondition, CRMCustomFieldSection, CRMCustomFieldType, CRMCustomSubField } from '~/types/crm'

const { customFields, funnels, addCustomField, updateCustomField, removeCustomField } = useCrmSettings()
const { categories } = useCategories()
const { products } = useProducts()
const toast = useToast()
const saving = ref(false)
const editingId = ref<string | null>(null)
const removingId = ref<string | null>(null)
const sectionLabels: Record<CRMCustomFieldSection, string> = { business: 'Negócio', product: 'Produto', client: 'Cliente' }

const form = reactive({
  label: '',
  section: 'business' as CRMCustomFieldSection,
  type: 'text' as CRMCustomFieldType,
  required: false,
  defaultValue: false as boolean | null,
  isBusinessValue: false,
  options: [] as string[],
  subFields: [] as CRMCustomSubField[],
  conditions: [] as CRMCustomFieldCondition[]
})

const resetForm = () => {
  editingId.value = null
  form.label = ''
  form.section = 'business'
  form.type = 'text'
  form.required = false
  form.defaultValue = false
  form.isBusinessValue = false
  form.options = []
  form.subFields = []
  form.conditions = []
}

const editField = (field: CRMCustomField) => {
  editingId.value = field.id
  form.label = field.label
  form.section = field.section
  form.type = field.type
  form.required = field.required
  form.defaultValue = field.defaultValue ?? false
  form.isBusinessValue = field.isBusinessValue
  form.options = [...field.options]
  form.subFields = field.subFields.map(subField => ({ ...subField, options: [...subField.options] }))
  form.conditions = field.conditions.map(condition => ({ ...condition, value: [...condition.value] }))
}

const addSubField = () => form.subFields.push({
  key: `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  label: '', type: 'text', required: false, options: [], position: form.subFields.length
})
const removeSubField = (index: number) => {
  form.subFields.splice(index, 1)
  form.subFields.forEach((subField, position) => { subField.position = position })
}

const conditionOptions = (field: CRMCustomFieldCondition['field']) => {
  if (field === 'category_id') return categories.value.map(item => ({ id: String(item.id), name: item.name }))
  if (field === 'product_id') return products.value.map(item => ({ id: String(item.id), name: item.name }))
  return funnels.value.map(item => ({ id: String(item.id), name: item.name }))
}
const addCondition = () => form.conditions.push({ field: 'category_id', operator: 'equals', value: [] })
const resetConditionValue = (condition: CRMCustomFieldCondition) => {
  condition.value = []
}
const conditionLabel = (condition: CRMCustomFieldCondition) => {
  const field = condition.field === 'category_id' ? 'Categoria' : condition.field === 'product_id' ? 'Produto' : 'Funil'
  const options = conditionOptions(condition.field)
  const value = condition.value.map(id => options.find(item => item.id === id)?.name || id).join(', ')
  return `${field} ${condition.operator === 'equals' ? '=' : '≠'} ${value}`
}
const conditionSummary = (field: CRMCustomField) => field.conditions.length ? field.conditions.map(conditionLabel).join(' e ') : 'Sempre exibido'

const saveField = async () => {
  const options = form.type === 'select' ? form.options.map(item => item.trim()).filter(Boolean) : []
  if (form.type === 'select' && !options.length) { toast.error('Adicione ao menos uma opção para o campo de seleção.'); return }
  const subFields = form.type === 'group' ? form.subFields.map((subField, position) => ({
    ...subField,
    label: subField.label.trim(),
    options: subField.type === 'select' ? subField.options.map(item => item.trim()).filter(Boolean) : [],
    position
  })) : []
  if (form.type === 'group' && !subFields.length) { toast.error('Adicione ao menos um subcampo à lista repetível.'); return }
  if (subFields.some(subField => !subField.label)) { toast.error('Informe o nome de todos os subcampos.'); return }
  if (subFields.some(subField => subField.type === 'select' && !subField.options.length)) { toast.error('Adicione ao menos uma opção nos subcampos de seleção.'); return }
  if (form.conditions.some(condition => !condition.value.length)) {
    toast.error('Selecione ao menos uma opção em cada condição de exibição.'); return
  }
  saving.value = true
  try {
    const payload = { ...form, label: form.label.trim(), defaultValue: form.type === 'checkbox' ? form.defaultValue ?? false : null, isBusinessValue: form.type === 'currency' ? form.isBusinessValue : false, options, subFields, conditions: form.conditions.map(item => ({ ...item, value: [...item.value] })), visibleWhen: form.conditions.length ? form.conditions.map(conditionLabel).join(' e ') : 'Sempre exibido' }
    if (editingId.value) await updateCustomField(editingId.value, payload)
    else await addCustomField(payload)
    toast.success(editingId.value ? 'Campo atualizado com sucesso.' : 'Campo personalizado adicionado com sucesso.')
    resetForm()
  } catch {
    // Request errors are displayed globally by useApi.
  } finally { saving.value = false }
}

const deleteField = async (field: CRMCustomField) => {
  if (!await toast.confirm(`O campo “${field.label}” será removido permanentemente.`, { title: 'Remover campo?', confirmLabel: 'Remover' })) return
  removingId.value = field.id
  try {
    await removeCustomField(field.id)
    if (editingId.value === field.id) resetForm()
    toast.success('Campo removido com sucesso.')
  } catch {
    // Request errors are displayed globally by useApi.
  } finally { removingId.value = null }
}

watch(() => form.section, section => {
  if (section !== 'business') {
    form.conditions.forEach(condition => {
      if (condition.field === 'product_id' || condition.field === 'funnel_id') {
        condition.field = 'category_id'
        condition.value = []
      }
    })
  }
})

watch(() => form.type, type => {
  if (type !== 'currency') form.isBusinessValue = false
})
</script>
