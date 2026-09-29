<template>
  <div class="settings-page space-y-6">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Checklists</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Configure os itens e as regras de aplicação das checklists dos negócios.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <NuxtLink to="/configuracoes" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"><Icon name="mdi:arrow-left" size="16" />Configurações</NuxtLink>
        <button type="button" class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm dark:bg-slate-100 dark:text-slate-900" @click="openCreate"><Icon name="mdi:plus" size="18" />Nova checklist</button>
      </div>
    </div>

    <p v-if="loadError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{{ loadError }}</p>
    <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">Carregando checklists...</div>
    <div v-else-if="!checklists.length" class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
      <Icon name="mdi:checkbox-marked-outline" size="42" class="mx-auto text-slate-300 dark:text-slate-600" />
      <h2 class="mt-4 font-semibold text-slate-900 dark:text-slate-100">Nenhuma checklist configurada</h2>
      <p class="mt-1 text-sm text-slate-500">Crie a primeira checklist para orientar o atendimento dos negócios.</p>
      <button type="button" class="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white" @click="openCreate">Criar checklist</button>
    </div>
    <div v-else class="grid gap-5 lg:grid-cols-2">
      <section v-for="checklist in checklists" :key="checklist.id" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ checklist.title }}</h2>
              <span class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide" :class="checklist.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'">{{ checklist.active ? 'Ativa' : 'Inativa' }}</span>
            </div>
            <p v-if="checklist.description" class="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400">{{ checklist.description }}</p>
          </div>
          <div class="flex shrink-0 gap-1">
            <button type="button" class="icon-button" title="Editar checklist" @click="openEdit(checklist)"><Icon name="mdi:pencil-outline" size="17" /></button>
            <button type="button" class="icon-button text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30" title="Remover checklist" @click="removeChecklist(checklist)"><Icon name="mdi:trash-can-outline" size="17" /></button>
          </div>
        </div>
        <div class="mt-5 grid gap-3 sm:grid-cols-3">
          <div class="summary-box"><span>Funis</span><strong>{{ checklist.funnelNames.join(', ') || '—' }}</strong></div>
          <div class="summary-box"><span>Itens</span><strong>{{ checklist.items.length }}</strong></div>
          <div class="summary-box"><span>Regras</span><strong>{{ checklist.conditions.length || 'Todas' }}</strong></div>
        </div>
        <div class="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Itens da checklist</p>
          <ol class="mt-3 space-y-2">
            <li v-for="item in checklist.items" :key="item.id || item.position" class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-800">{{ item.position }}</span><span>{{ item.label }}</span><span v-if="item.required" class="text-[10px] font-semibold text-rose-500">obrigatório</span></li>
            <li v-if="!checklist.items.length" class="text-sm text-slate-400">Nenhum item cadastrado.</li>
          </ol>
        </div>
        <div v-if="checklist.conditions.length" class="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Regras de aplicação</p>
          <ul class="mt-3 space-y-2"><li v-for="condition in checklist.conditions" :key="condition.id || `${checklist.id}-${condition.funnelId}`" class="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-300">{{ conditionLabel(condition) }}</li></ul>
        </div>
      </section>
    </div>

    <div v-if="lastPage > 1" class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
      <span class="text-slate-500">{{ total }} checklist(s)</span>
      <div class="flex items-center gap-2"><button type="button" class="page-button" :disabled="page <= 1" @click="load(page - 1)">Anterior</button><span class="text-xs text-slate-500">{{ page }} / {{ lastPage }}</span><button type="button" class="page-button" :disabled="page >= lastPage" @click="load(page + 1)">Próxima</button></div>
    </div>

    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" @click.self="closeModal">
      <section class="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4"><div><h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">{{ editingId ? 'Editar checklist' : 'Nova checklist' }}</h2><p class="mt-1 text-sm text-slate-500">Configure itens e regras de aplicação.</p></div><button type="button" class="icon-button" @click="closeModal"><Icon name="mdi:close" size="18" /></button></div>
        <p v-if="formError" class="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{{ formError }}</p>
        <form class="mt-6 space-y-6" @submit.prevent="saveChecklist">
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1.5 sm:col-span-2"><span class="field-label">Título *</span><input v-model.trim="form.title" maxlength="255" required class="field-input" /></label>
            <label class="space-y-1.5 sm:col-span-2"><span class="field-label">Descrição</span><textarea v-model.trim="form.description" rows="2" class="field-input resize-none" /></label>
            <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><input v-model="form.active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600" /> Checklist ativa</label>
            <label class="space-y-1.5"><span class="field-label">Funis *</span><select v-model="form.funnelIds" multiple required class="field-input h-24"><option v-for="funnel in funnels" :key="funnel.id" :value="funnel.id">{{ funnel.name }}</option></select></label>
          </div>

          <div class="border-t border-slate-100 pt-5 dark:border-slate-800"><div class="flex items-center justify-between"><h3 class="section-title">Itens</h3><button type="button" class="text-xs font-bold text-indigo-600" @click="addItem">+ Adicionar item</button></div><div class="mt-3 space-y-2"><div v-for="(item, index) in form.items" :key="item.id || `new-${index}`" class="flex items-center gap-2"><span class="w-6 text-center text-xs font-bold text-slate-400">{{ index + 1 }}</span><input v-model.trim="item.label" required maxlength="255" class="field-input flex-1" placeholder="Descrição do item" /><label class="inline-flex shrink-0 items-center gap-1 text-xs text-slate-500"><input v-model="item.required" type="checkbox" class="rounded border-slate-300 text-indigo-600" />Obrigatório</label><button type="button" class="icon-button text-rose-500" title="Remover item" @click="removeItem(index)"><Icon name="mdi:trash-can-outline" size="16" /></button></div><p v-if="!form.items.length" class="text-sm text-slate-400">Nenhum item adicionado.</p></div></div>

          <div class="border-t border-slate-100 pt-5 dark:border-slate-800"><div class="flex items-center justify-between"><div><h3 class="section-title">Regras de aplicação</h3><p class="mt-1 text-xs text-slate-500">Sem produtos, a regra vale para todos os produtos do funil.</p></div><button type="button" class="text-xs font-bold text-indigo-600" @click="addCondition">+ Adicionar regra</button></div><div class="mt-3 space-y-3"><div v-for="(condition, index) in form.conditions" :key="condition.id || `condition-${index}`" class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><div class="grid gap-3 md:grid-cols-3"><label class="space-y-1"><span class="field-label">Funil</span><select v-model="condition.funnelId" required class="field-input" @change="condition.productIds = []"><option value="" disabled>Selecione</option><option v-for="funnel in funnels" :key="funnel.id" :value="funnel.id">{{ funnel.name }}</option></select></label><label class="space-y-1"><span class="field-label">Produtos</span><select v-model="condition.productIds" multiple class="field-input h-20"><option v-for="product in productsForFunnel(condition.funnelId)" :key="product.id" :value="product.id">{{ product.name }}</option></select></label><label class="space-y-1"><span class="field-label">Etapa mínima</span><select v-model="condition.minStageId" class="field-input"><option :value="null">Qualquer etapa</option><option v-for="stage in stagesForFunnel(condition.funnelId)" :key="stage.id" :value="stage.id">{{ stage.title }}</option></select></label></div><button type="button" class="mt-2 text-xs font-semibold text-rose-500" @click="removeCondition(index)">Remover regra</button></div><p v-if="!form.conditions.length" class="text-sm text-slate-400">Nenhuma regra específica. A checklist poderá ser aplicada conforme o funil associado.</p></div></div>

          <div class="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-slate-800"><button type="button" class="page-button" @click="closeModal">Cancelar</button><button type="submit" :disabled="saving" class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{{ saving ? 'Salvando...' : 'Salvar checklist' }}</button></div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CRMChecklist, CRMChecklistCondition, CRMChecklistItem } from '~/types/crm'
import type { ChecklistPayload } from '~/composables/useChecklists'

const { user } = useAuth()
const { funnels } = useFunnels()
const { products } = useProducts()
const { checklists, page, lastPage, total, loading, saving, error: loadError, load, save, remove } = useChecklists()
const toast = useToast()
const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const formError = ref('')
const form = reactive<ChecklistPayload>({ title: '', description: '', active: true, funnelIds: [], items: [], conditions: [] })

const isAuthorized = computed(() => ['master', 'admin'].includes(String(user.value?.role || '').toLowerCase()))
if (import.meta.client && !isAuthorized.value) await navigateTo('/')

const emptyForm = () => { form.title = ''; form.description = ''; form.active = true; form.funnelIds = []; form.items = []; form.conditions = [] }
const openCreate = () => { editingId.value = null; formError.value = ''; emptyForm(); modalOpen.value = true }
const openEdit = (checklist: CRMChecklist) => {
  editingId.value = checklist.id
  formError.value = ''
  form.title = checklist.title
  form.description = checklist.description
  form.active = checklist.active
  form.funnelIds = [...checklist.funnelIds]
  form.items = checklist.items.map(item => ({ ...item }))
  form.conditions = checklist.conditions.map(condition => ({ ...condition, productIds: [...condition.productIds] }))
  modalOpen.value = true
}
const closeModal = () => { if (!saving.value) modalOpen.value = false }
const addItem = () => form.items.push({ label: '', position: form.items.length + 1, required: false })
const removeItem = (index: number) => form.items.splice(index, 1)
const addCondition = () => form.conditions.push({ funnelId: form.funnelIds[0] || '', productIds: [], minStageId: null })
const removeCondition = (index: number) => form.conditions.splice(index, 1)
const productsForFunnel = (funnelId: string) => products.value.filter(product => product.funnelIds.includes(String(funnelId)))
const stagesForFunnel = (funnelId: string) => funnels.value.find(funnel => String(funnel.id) === String(funnelId))?.stages || []
const conditionLabel = (condition: CRMChecklist['conditions'][number]) => {
  const funnel = funnels.value.find(item => String(item.id) === String(condition.funnelId))
  const selectedProducts = products.value.filter(product => condition.productIds.includes(product.id)).map(product => product.name)
  const stage = stagesForFunnel(condition.funnelId).find(item => String(item.id) === String(condition.minStageId))
  const productLabel = selectedProducts.length ? selectedProducts.join(', ') : 'todos os produtos'
  return `${funnel?.name || 'Funil'} · ${productLabel}${stage ? ` · a partir de ${stage.title}` : ''}`
}
const saveChecklist = async () => {
  formError.value = ''
  if (!form.title.trim() || !form.funnelIds.length) { formError.value = 'Informe o título e selecione ao menos um funil.'; return }
  if (form.conditions.some(condition => !condition.funnelId || !form.funnelIds.includes(condition.funnelId))) { formError.value = 'Todas as regras devem usar um funil associado à checklist.'; return }
  try { await save(form, editingId.value || undefined); await load(page.value); modalOpen.value = false; toast.success(editingId.value ? 'Checklist atualizada.' : 'Checklist criada.') } catch (cause) { formError.value = cause instanceof Error ? cause.message : 'Não foi possível salvar a checklist.' }
}
const removeChecklist = async (checklist: CRMChecklist) => {
  if (!await toast.confirm(`A checklist “${checklist.title}” será removida com seus itens.`, { title: 'Remover checklist?', confirmLabel: 'Remover' })) return
  try { await remove(checklist.id); toast.success('Checklist removida.') } catch { /* useApi exibe a mensagem da API. */ }
}

await load()
</script>

<style scoped>
.field-label { @apply block text-xs font-semibold text-slate-600 dark:text-slate-300; }
.field-input { @apply w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200; }
.icon-button { @apply inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800; }
.page-button { @apply rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300; }
.summary-box { @apply rounded-xl bg-slate-50 p-3 dark:bg-slate-950; }
.summary-box span { @apply block text-[10px] font-semibold uppercase tracking-wide text-slate-400; }
.summary-box strong { @apply mt-1 block text-sm text-slate-700 dark:text-slate-200; }
.section-title { @apply text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400; }
</style>
