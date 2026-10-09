<template>
  <div class="w-full space-y-6">
    <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.24em] text-indigo-500">Gestão e performance</p>
        <h1 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Relatório de produção</h1>
        <p class="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Consolide a produção da instância por período, usuário, produto e campos personalizados.</p>
      </div>
      <button type="button" :disabled="!report || loading" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" @click="exportCsv">
        <span class="material-icons text-[18px]">download</span> Exportar CSV
      </button>
    </header>

    <section class="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-950 dark:bg-indigo-950/20 md:p-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><h2 class="text-sm font-bold text-indigo-900 dark:text-indigo-200">Relatórios salvos</h2><p class="mt-1 text-xs text-indigo-700/70 dark:text-indigo-300/70">Salve uma combinação de filtros para reutilizar em poucos cliques.</p></div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <select v-model="selectedSavedId" class="control min-w-64 border-indigo-200 bg-white dark:border-indigo-900 dark:bg-slate-900"><option value="">Selecione um relatório salvo</option><option v-for="saved in savedReports" :key="saved.id" :value="String(saved.id)">{{ saved.name }}</option></select>
          <button type="button" :disabled="!selectedSavedId" class="rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs font-bold text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300" @click="applySavedReport">Usar filtros</button>
          <button type="button" :disabled="!selectedSavedId" class="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300" @click="removeSavedReport">Excluir</button>
        </div>
      </div>
      <div class="mt-4 flex flex-col gap-2 sm:flex-row"><input v-model="savedName" class="control max-w-md border-indigo-200 bg-white dark:border-indigo-900 dark:bg-slate-900" placeholder="Nome do relatório, ex.: Produção semanal"><button type="button" :disabled="!savedName.trim()" class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50" @click="saveCurrentReport"><span class="material-icons text-[16px]">bookmark_add</span>Salvar filtros atuais</button></div>
      <p v-if="saveMessage" class="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{{ saveMessage }}</p>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Filtros do relatório</h2>
        <button type="button" class="text-xs font-semibold text-slate-500 hover:text-indigo-600" @click="resetFilters">Limpar filtros</button>
      </div>
      <form class="grid gap-4 md:grid-cols-2 xl:grid-cols-4" @submit.prevent="generate">
        <label class="space-y-1.5"><span class="label">De</span><input v-model="filters.from" type="date" required class="control"></label>
        <label class="space-y-1.5"><span class="label">Até</span><input v-model="filters.to" type="date" required class="control"></label>
        <label class="space-y-1.5"><span class="label">Responsável</span><select v-model="filters.userId" class="control"><option value="">Todos os usuários</option><option v-for="user in users" :key="user.id" :value="String(user.id)">{{ user.name }}</option></select></label>
        <label class="space-y-1.5"><span class="label">Produto</span><select v-model="filters.productId" class="control"><option value="">Todos os produtos</option><option v-for="product in products" :key="product.id" :value="String(product.id)">{{ product.name }}</option></select></label>

        <div class="md:col-span-2 xl:col-span-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/50">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label class="min-w-0 flex-1 space-y-1.5"><span class="label">Filtrar campo personalizado</span><select v-model="draftFilter.fieldId" class="control"><option value="">Selecione um campo</option><option v-for="field in filterFields" :key="field.id" :value="field.id">{{ field.label }}</option></select></label>
            <label class="w-full space-y-1.5 lg:w-40"><span class="label">Operador</span><select v-model="draftFilter.operator" class="control"><option value="equals">Igual a</option><option value="contains">Contém</option><option value="gte">Maior ou igual</option><option value="lte">Menor ou igual</option></select></label>
            <label class="min-w-0 flex-1 space-y-1.5"><span class="label">Valor</span><input v-model="draftFilter.value" class="control" placeholder="Valor do campo"></label>
            <button type="button" class="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500" @click="addFilter">Adicionar filtro</button>
          </div>
          <div v-if="filters.customFilters.length" class="mt-3 flex flex-wrap gap-2">
            <span v-for="(filter, index) in filters.customFilters" :key="`${filter.fieldId}-${index}`" class="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {{ fieldLabel(filter.fieldId) }} {{ operatorLabel(filter.operator) }} “{{ filter.value }}”
              <button type="button" class="text-indigo-500 hover:text-rose-500" aria-label="Remover filtro" @click="filters.customFilters.splice(index, 1)">×</button>
            </span>
          </div>
        </div>

        <fieldset class="md:col-span-2 xl:col-span-4">
          <legend class="label mb-2">Somar campos numéricos</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="field in sumFields" :key="field.id" class="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition" :class="filters.sumFieldIds.includes(field.id) ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'"><input v-model="filters.sumFieldIds" type="checkbox" :value="field.id" class="rounded border-slate-300 text-indigo-600">{{ field.label }}</label>
            <span v-if="!sumFields.length" class="text-xs text-slate-400">Nenhum campo de moeda ou número cadastrado.</span>
          </div>
        </fieldset>
        <div class="md:col-span-2 xl:col-span-4 flex justify-end"><button type="submit" :disabled="loading" class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"><span v-if="loading" class="material-icons animate-spin text-[17px]">refresh</span>{{ loading ? 'Gerando relatório...' : 'Gerar relatório' }}</button></div>
      </form>
      <p v-if="error" class="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ error }}</p>
    </section>

    <template v-if="report">
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="card in summaryCards" :key="card.label" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p class="text-xs font-bold uppercase tracking-wide text-slate-400">{{ card.label }}</p><p class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{{ card.value }}</p><p v-if="card.hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ card.hint }}</p></div>
      </section>
      <section class="grid gap-4 xl:grid-cols-2">
        <ReportDonutChart title="Ganhos x perdas x abertos" subtitle="Distribuição dos negócios no período" :items="statusChart" />
        <ReportBarChart title="Perdas por motivo" subtitle="Principais motivos informados" :items="lossReasonChart" />
        <ReportBarChart title="Perdas por usuário" subtitle="Quantidade de negócios perdidos por responsável" :items="lossUserChart" />
        <ReportBarChart title="Ganhos e perdas por produto" subtitle="Comparativo por produto" secondary-label="Perdidos" :items="productOutcomeChart" />
      </section>
      <section v-if="Object.keys(report.customFieldTotals).length" class="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-950 dark:bg-indigo-950/20"><h2 class="text-sm font-bold text-indigo-900 dark:text-indigo-200">Somas de campos personalizados</h2><div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div v-for="(value, fieldId) in report.customFieldTotals" :key="fieldId" class="rounded-xl bg-white/80 p-3 dark:bg-slate-900/70"><p class="text-xs text-slate-500 dark:text-slate-400">{{ fieldLabel(String(fieldId)) }}</p><p class="mt-1 font-bold text-indigo-700 dark:text-indigo-300">{{ formatCurrency(Number(value)) }}</p></div></div></section>
      <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><div class="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800"><div><h2 class="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Detalhamento</h2><p class="mt-1 text-xs text-slate-500">{{ report.rows.length }} linhas agrupadas</p></div><span class="text-xs text-slate-400">{{ filters.from }} — {{ filters.to }}</span></div><div v-if="!report.rows.length" class="p-10 text-center text-sm text-slate-500">Nenhum resultado para os filtros informados.</div><div v-else class="overflow-x-auto"><table class="min-w-full text-left text-sm"><thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400"><tr><th class="px-4 py-3">Usuário</th><th class="px-4 py-3">Produto</th><th class="px-4 py-3 text-right">Produção</th><th class="px-4 py-3 text-right">Valor</th><th class="px-4 py-3 text-right">Ganhos</th><th class="px-4 py-3 text-right">Perdidos</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800"><tr v-for="(row, index) in report.rows" :key="row.id || `${row.user_id}-${row.product_id}-${index}`" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"><td class="whitespace-nowrap px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{{ row.user_name || userName(row.user_id) || 'Não atribuído' }}</td><td class="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300">{{ row.product_name || productName(row.product_id) || 'Sem produto' }}</td><td class="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">{{ numberFormat(row.count ?? row.total) }}</td><td class="px-4 py-3 text-right text-slate-700 dark:text-slate-200">{{ formatCurrency(Number(row.total_value || 0)) }}</td><td class="px-4 py-3 text-right text-emerald-600">{{ numberFormat(row.won_count) }}</td><td class="px-4 py-3 text-right text-rose-500">{{ numberFormat(row.lost_count) }}</td></tr></tbody></table></div></section>
    </template>
    <div v-else class="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700"><span class="material-icons text-4xl text-slate-300 dark:text-slate-600">insights</span><p class="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Configure os filtros e gere seu primeiro relatório.</p></div>
  </div>
</template>

<script setup lang="ts">
import type { ProductionReportFilter } from '~/composables/useProductionReports'

const { user } = useAuth()
const { users, loadUsers } = useUsers()
const { products } = useProducts()
const { customFields, refreshCustomFields } = useCustomFields()
const { report, loading, error, loadReport, savedReports, loadSavedReports, saveReport, deleteSavedReport } = useProductionReports()
const localDateInput = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const monthStart = new Date(); monthStart.setDate(1)
const filters = reactive({ from: localDateInput(monthStart), to: localDateInput(), userId: '', productId: '', customFilters: [] as ProductionReportFilter[], sumFieldIds: [] as string[] })
const draftFilter = reactive<ProductionReportFilter>({ fieldId: '', operator: 'equals', value: '' })
const selectedSavedId = ref('')
const savedName = ref('')
const saveMessage = ref('')
const fieldLabel = (id: string) => customFields.value.find(field => String(field.id) === id)?.label || `Campo #${id}`
const filterFields = computed(() => customFields.value.filter(field => field.section === 'business' || field.section === 'product'))
const sumFields = computed(() => filterFields.value.filter(field => ['currency', 'number'].includes(field.type)))
const userName = (id: unknown) => users.value.find(item => String(item.id) === String(id))?.name
const productName = (id: unknown) => products.value.find(item => String(item.id) === String(id))?.name
const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
const numberFormat = (value: unknown) => new Intl.NumberFormat('pt-BR').format(Number(value || 0))
const operatorLabel = (operator: ProductionReportFilter['operator']) => ({ equals: '=', contains: 'contém', gte: '≥', lte: '≤' }[operator])
const summaryCards = computed(() => [{ label: 'Produção total', value: numberFormat(report.value?.summary.totalProduction), hint: `${numberFormat(report.value?.summary.totalCount)} negócios` }, { label: 'Valor produzido', value: formatCurrency(report.value?.summary.totalValue || 0) }, { label: 'Ganhos', value: numberFormat(report.value?.summary.wonCount) }, { label: 'Ticket médio', value: formatCurrency(report.value?.summary.averageValue || 0) }])
const statusChart = computed(() => [{ label: 'Ganhos', value: report.value?.summary.wonCount || 0, color: '#10b981' }, { label: 'Perdas', value: report.value?.summary.lostCount || 0, color: '#f43f5e' }, { label: 'Abertos', value: report.value?.summary.openCount || 0, color: '#6366f1' }])
const lossReasonChart = computed(() => (report.value?.lossReasons || []).slice(0, 8).map(item => ({ label: String(item.label || 'Sem motivo informado'), value: Number(item.count || 0) })))
const lossUserChart = computed(() => (report.value?.lossesByUser || []).slice(0, 8).map(item => ({ label: String(item.user_name || 'Não atribuído'), value: Number(item.count || item.lost_count || 0) })))
const productOutcomeChart = computed(() => (report.value?.outcomesByProduct || []).slice(0, 8).map(item => ({ label: String(item.product_name || 'Sem produto'), value: Number(item.won_count || 0), secondaryValue: Number(item.lost_count || 0) })))
const addFilter = () => { if (!draftFilter.fieldId || !draftFilter.value.trim()) return; filters.customFilters.push({ ...draftFilter, value: draftFilter.value.trim() }); draftFilter.fieldId = ''; draftFilter.value = '' }
const resetFilters = () => { filters.userId = ''; filters.productId = ''; filters.customFilters = []; filters.sumFieldIds = []; const start = new Date(); start.setDate(1); filters.from = localDateInput(start); filters.to = localDateInput() }
const generate = async () => { if (filters.from > filters.to) return; await loadReport(filters) }
const applySavedReport = async () => { const saved = savedReports.value.find(item => String(item.id) === selectedSavedId.value); if (!saved) return; const stored = saved.filters as Partial<typeof filters>; filters.from = String(stored.from || filters.from); filters.to = String(stored.to || filters.to); filters.userId = String(stored.userId || ''); filters.productId = String(stored.productId || ''); filters.customFilters = Array.isArray(stored.customFilters) ? stored.customFilters as ProductionReportFilter[] : []; filters.sumFieldIds = Array.isArray(stored.sumFieldIds) ? stored.sumFieldIds.map(String) : []; await generate() }
const saveCurrentReport = async () => { if (!savedName.value.trim()) return; await saveReport(savedName.value.trim(), { from: filters.from, to: filters.to, userId: filters.userId, productId: filters.productId, customFilters: filters.customFilters, sumFieldIds: filters.sumFieldIds }); saveMessage.value = 'Filtros salvos com sucesso.'; savedName.value = '' }
const removeSavedReport = async () => { if (!selectedSavedId.value) return; await deleteSavedReport(Number(selectedSavedId.value)); selectedSavedId.value = ''; saveMessage.value = 'Relatório removido.' }
const exportCsv = () => { if (!report.value) return; const headers = ['Usuário', 'Produto', 'Produção', 'Valor', 'Ganhos', 'Perdidos']; const rows = report.value.rows.map(row => [row.user_name || userName(row.user_id) || 'Não atribuído', row.product_name || productName(row.product_id) || 'Sem produto', row.count ?? row.total ?? 0, row.total_value ?? 0, row.won_count ?? 0, row.lost_count ?? 0]); const csv = [headers, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\n'); const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `relatorio-producao-${filters.from}-${filters.to}.csv`; link.click(); URL.revokeObjectURL(url) }
onMounted(async () => { await Promise.all([loadUsers(), refreshCustomFields(), loadSavedReports()]); await generate() })
if (import.meta.client && user.value && !['master', 'admin'].includes(user.value.role.toLowerCase())) await navigateTo('/')
</script>

<style scoped>
.label { @apply block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400; }
.control { @apply w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100; }
</style>
