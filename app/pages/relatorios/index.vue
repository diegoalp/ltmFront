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

    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Filtros do relatório</h2>
        <button type="button" class="text-xs font-semibold text-slate-500 hover:text-indigo-600" @click="resetFilters">Limpar filtros</button>
      </div>
      <form class="grid gap-4 md:grid-cols-2 xl:grid-cols-4" @submit.prevent="generate">
        <label class="space-y-1.5"><span class="label">De</span><input v-model="filters.from" type="date" required class="control"></label>
        <label class="space-y-1.5"><span class="label">Até</span><input v-model="filters.to" type="date" required class="control"></label>
        <label class="space-y-1.5"><span class="label">Funil obrigatório</span><select v-model="filters.funnelId" class="control"><option value="">Selecione o funil</option><option v-for="funnel in funnels" :key="funnel.id" :value="String(funnel.id)">{{ funnel.name }}</option></select></label>
        <label class="space-y-1.5"><span class="label">Responsável</span><select v-model="filters.userId" :disabled="!filters.funnelId || resourcesLoading" class="control"><option value="">Todos os usuários do funil</option><option v-for="user in users" :key="user.id" :value="String(user.id)">{{ user.name }}</option></select></label>
        <label class="space-y-1.5"><span class="label">Produto</span><select v-model="filters.productId" :disabled="!filters.funnelId || resourcesLoading" class="control"><option value="">Todos os produtos do funil</option><option v-for="product in products" :key="product.id" :value="String(product.id)">{{ product.name }}</option></select></label>
        <label class="space-y-1.5"><span class="label">Categoria</span><select v-model="filters.categoryId" :disabled="!filters.funnelId || resourcesLoading" class="control"><option value="">Todas as categorias do funil</option><option v-for="category in categories" :key="category.id" :value="String(category.id)">{{ category.name }}</option></select></label>

        <fieldset class="relative md:col-span-2 xl:col-span-4">
          <legend class="label mb-2">Campos exibidos no relatório</legend>
          <button type="button" class="inline-flex min-w-72 items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200" @click="showFieldMenu = !showFieldMenu">
            <span class="flex items-center gap-2"><span class="material-icons text-[18px] text-indigo-500">tune</span>{{ displayFieldIds.length ? `${displayFieldIds.length} campo(s) selecionado(s)` : 'Selecionar campos' }}</span><span class="material-icons text-[18px] text-slate-400">{{ showFieldMenu ? 'expand_less' : 'expand_more' }}</span>
          </button>
          <div v-if="showFieldMenu" class="absolute z-20 mt-2 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div class="mb-3 flex items-start justify-between gap-4"><div><p class="text-sm font-bold text-slate-900 dark:text-white">Escolha os campos exibidos</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Campos de negócio já vêm selecionados. Cliente e produto são opcionais.</p></div><button type="button" class="text-xs font-semibold text-slate-500 hover:text-indigo-600" @click="showFieldMenu = false">Fechar</button></div>
            <div v-if="reportFields.length" class="grid gap-4 sm:grid-cols-3">
              <div v-for="group in fieldGroups" :key="group.key" class="space-y-2"><p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">{{ group.label }}</p><label v-for="field in group.fields" :key="field.id" class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"><input v-model="displayFieldIds" type="checkbox" :value="field.id" class="rounded border-slate-300 text-indigo-600">{{ field.label }}</label><p v-if="!group.fields.length" class="px-2 text-xs text-slate-400">Nenhum campo</p></div>
            </div>
            <p v-else class="text-xs text-slate-400">Nenhum campo personalizado cadastrado.</p>
          </div>
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">{{ displayFieldIds.length ? 'Os campos selecionados ficam disponíveis na análise.' : 'Nenhum campo adicional selecionado.' }}</p>
        </fieldset>
        <fieldset class="md:col-span-2 xl:col-span-4">
          <legend class="label mb-2">Somar campos numéricos</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="field in sumFields" :key="field.id" class="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition" :class="filters.sumFieldIds.includes(field.id) ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'"><input v-model="filters.sumFieldIds" type="checkbox" :value="field.id" class="rounded border-slate-300 text-indigo-600">{{ field.label }}</label>
            <span v-if="!sumFields.length" class="text-xs text-slate-400">Nenhum campo de moeda ou número cadastrado.</span>
          </div>
        </fieldset>
        <div class="md:col-span-2 xl:col-span-4 flex items-center justify-between gap-3"><p class="text-xs text-slate-500 dark:text-slate-400">{{ !filters.funnelId ? 'Selecione um funil para carregar usuários, produtos e categorias.' : resourcesLoading ? 'Carregando dados do funil...' : `Dados filtrados para: ${selectedFunnelName}` }}</p><button type="submit" :disabled="loading || !filters.funnelId || resourcesLoading" class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"><span v-if="loading || resourcesLoading" class="material-icons animate-spin text-[17px]">refresh</span>{{ loading ? 'Gerando relatório...' : 'Gerar relatório' }}</button></div>
      </form>
      <p v-if="error" class="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ error }}</p>
    </section>

    <template v-if="report">
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="card in summaryCards" :key="card.label" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p class="text-xs font-bold uppercase tracking-wide text-slate-400">{{ card.label }}</p><p class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{{ card.value }}</p><p v-if="card.hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ card.hint }}</p></div>
      </section>
      <section class="grid gap-4 xl:grid-cols-2">
        <ReportTrendChart title="Evolução da produção" subtitle="Negócios criados por dia no período" :items="dailyProductionChart" />
        <ReportDonutChart title="Ganhos x perdas x abertos" subtitle="Distribuição dos negócios no período" :items="statusChart" />
        <ReportBarChart v-if="!filters.userId" title="Negócios por usuário" subtitle="Quantidade de negócios por responsável" :items="userCountChart" />
        <ReportBarChart title="Negócios por produto" subtitle="Quantidade de negócios por produto" :items="productCountChart" />
        <ReportBarChart title="Motivos de perda" subtitle="Negócios perdidos no período" :items="lossReasonChart" />
        <ReportBarChart title="Categorias" subtitle="Volume e valor por categoria" :items="categoryChart" :secondary-label="'Valor (R$)'" :format-value="numberFormat" />
        <ReportBarChart title="Etapas do funil" subtitle="Distribuição dos negócios por etapa" :items="stageChart" />
      </section>
      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-start justify-between gap-3"><div><h2 class="text-sm font-bold text-slate-900 dark:text-white">Avaliação de desempenho por usuário</h2><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Conversão, valores e atividades realizadas no período.</p></div><span class="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">{{ report.summary.conversionRate.toFixed(1) }}% de conversão geral</span></div>
        <div class="mt-4 overflow-x-auto"><table class="w-full min-w-[720px] text-left text-xs"><thead class="border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400 dark:border-slate-800"><tr><th class="px-3 py-3">Usuário</th><th class="px-3 py-3">Negócios</th><th class="px-3 py-3">Ganhos</th><th class="px-3 py-3">Conversão</th><th class="px-3 py-3">Valor ganho</th><th class="px-3 py-3">Atividades</th></tr></thead><tbody><tr v-for="item in report.userPerformance" :key="String(item.id)" class="border-b border-slate-50 last:border-0 dark:border-slate-800/60"><td class="px-3 py-3 font-semibold text-slate-800 dark:text-slate-200">{{ item.label }}</td><td class="px-3 py-3 text-slate-600 dark:text-slate-300">{{ numberFormat(item.total_count) }}</td><td class="px-3 py-3 font-semibold text-emerald-600">{{ numberFormat(item.won_count) }}</td><td class="px-3 py-3">{{ numberFormat(item.conversion_rate) }}%</td><td class="px-3 py-3 font-semibold">{{ formatCurrency(item.won_value || 0) }}</td><td class="px-3 py-3">{{ numberFormat(item.completed_activity_count) }} / {{ numberFormat(item.activity_count) }}</td></tr></tbody></table></div>
      </section>
      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><div v-for="card in insightCards" :key="card.label" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p class="text-xs font-bold uppercase tracking-wide text-slate-400">{{ card.label }}</p><p class="mt-2 text-xl font-bold text-slate-900 dark:text-white">{{ card.value }}</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ card.hint }}</p></div></section>
      <section v-if="visibleCustomFieldTotals.length" class="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-950 dark:bg-indigo-950/20"><h2 class="text-sm font-bold text-indigo-900 dark:text-indigo-200">Somas selecionadas</h2><div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div v-for="item in visibleCustomFieldTotals" :key="item.id" class="rounded-xl bg-white/80 p-3 dark:bg-slate-900/70"><p class="text-xs text-slate-500 dark:text-slate-400">{{ item.label }}</p><p class="mt-1 font-bold text-indigo-700 dark:text-indigo-300">{{ formatCurrency(item.value) }}</p></div></div></section>
    </template>
    <div v-else class="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700"><span class="material-icons text-4xl text-slate-300 dark:text-slate-600">insights</span><p class="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Configure os filtros e gere seu primeiro relatório.</p></div>
  </div>
</template>

<script setup lang="ts">

import ReportBarChart from '~/components/reports/ReportBarChart.vue'
import ReportDonutChart from '~/components/reports/ReportDonutChart.vue'
import ReportTrendChart from '~/components/reports/ReportTrendChart.vue'

const { user } = useAuth()
const { users, loadUsers } = useUsers({ autoLoad: false })
const { products, refreshProducts, productsLoading } = useProducts({ autoLoad: false })
const { customFields, refreshCustomFields } = useCustomFields()
const { categories, refreshCategories, categoriesLoading } = useCategories({ autoLoad: false })
const { funnels, refreshFunnels } = useFunnels()
const { report, loading, error, loadReport } = useProductionReports()
const localDateInput = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const monthStart = new Date(); monthStart.setMonth(monthStart.getMonth() - 2); monthStart.setDate(1)
const filters = reactive({ from: localDateInput(monthStart), to: localDateInput(), funnelId: '', userId: '', productId: '', categoryId: '', sumFieldIds: [] as string[] })
const showFieldMenu = ref(false)
const resourcesLoading = computed(() => productsLoading.value || categoriesLoading.value)
const selectedFunnelName = computed(() => funnels.value.find(funnel => String(funnel.id) === filters.funnelId)?.name || '')
const displayFieldIds = ref<string[]>([])
const fieldLabel = (id: string) => customFields.value.find(field => String(field.id) === id)?.label || `Campo #${id}`
const reportFields = computed(() => customFields.value.filter(field => ['business', 'product', 'client'].includes(field.section) && field.type !== 'group'))
const fieldGroups = computed(() => [
  { key: 'business', label: 'Negócio', fields: reportFields.value.filter(field => field.section === 'business') },
  { key: 'product', label: 'Produto', fields: reportFields.value.filter(field => field.section === 'product') },
  { key: 'client', label: 'Cliente', fields: reportFields.value.filter(field => field.section === 'client') }
])
const sumFields = computed(() => reportFields.value.filter(field => ['currency', 'number'].includes(field.type)))
const userName = (id: unknown) => users.value.find(item => String(item.id) === String(id))?.name
const productName = (id: unknown) => products.value.find(item => String(item.id) === String(id))?.name
const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
const numberFormat = (value: unknown) => new Intl.NumberFormat('pt-BR').format(Number(value || 0))
watch(reportFields, fields => { if (!displayFieldIds.value.length) displayFieldIds.value = fields.filter(field => field.section === 'business').map(field => field.id) }, { immediate: true })
const summaryCards = computed(() => [{ label: 'Negócios analisados', value: numberFormat(report.value?.summary.totalCount), hint: `${numberFormat(report.value?.summary.openCount)} em aberto` }, { label: 'Valor em pipeline', value: formatCurrency(report.value?.summary.totalValue || 0), hint: `Ganhos: ${formatCurrency(report.value?.summary.wonValue || 0)}` }, { label: 'Taxa de conversão', value: `${numberFormat(report.value?.summary.conversionRate)}%`, hint: `${numberFormat(report.value?.summary.wonCount)} negócios ganhos` }, { label: 'Ticket médio', value: formatCurrency(report.value?.summary.averageValue || 0), hint: `Perdas: ${formatCurrency(report.value?.summary.lostValue || 0)}` }])
const statusChart = computed(() => [{ label: 'Ganhos', value: report.value?.summary.wonCount || 0, color: '#10b981', status: 3, businesses: report.value?.statusBreakdown.find(item => item.status === 3)?.businesses || [] }, { label: 'Perdas', value: report.value?.summary.lostCount || 0, color: '#f43f5e', status: 2, businesses: report.value?.statusBreakdown.find(item => item.status === 2)?.businesses || [] }, { label: 'Abertos', value: report.value?.summary.openCount || 0, color: '#6366f1', status: 1, businesses: report.value?.statusBreakdown.find(item => item.status === 1)?.businesses || [] }])
const dailyProductionChart = computed(() => (report.value?.dailyBreakdown || []).map(item => ({ label: String(item.label || item.date || ''), value: Number(item.total_count || 0) })))
const lossReasonChart = computed(() => (report.value?.lossReasons || []).slice(0, 8).map(item => ({ label: String(item.label || 'Sem motivo informado'), value: Number(item.count || 0) })))
const aggregateRows = (key: 'user_id' | 'product_id', nameKey: 'user_name' | 'product_name', fallback: string) => {
  const totals = new Map<string, { label: string, value: number }>()
  for (const row of report.value?.rows || []) {
    const id = row[key] == null ? fallback : String(row[key])
    const label = String(row[nameKey] || (key === 'user_id' ? userName(row[key]) : productName(row[key])) || fallback)
    const current = totals.get(id) || { label, value: 0 }
    current.value += Number(row.count ?? row.total ?? 0)
    totals.set(id, current)
  }
  return [...totals.values()].sort((left, right) => right.value - left.value).slice(0, 8)
}
const userCountChart = computed(() => aggregateRows('user_id', 'user_name', 'Não atribuído'))
const productCountChart = computed(() => {
  const aggregated = aggregateRows('product_id', 'product_name', 'Sem produto')
  if (aggregated.length) return aggregated
  return (report.value?.outcomesByProduct || []).map(item => ({ label: String(item.product_name || 'Sem produto'), value: Number(item.total_count || item.count || item.won_count || 0) })).sort((left, right) => right.value - left.value).slice(0, 8)
})
const categoryChart = computed(() => (report.value?.categoryPerformance || []).slice(0, 8).map(item => ({ label: String(item.label || 'Sem categoria'), value: Number(item.total_count || 0), secondaryValue: Number(item.total_value || 0) })))
const stageChart = computed(() => (report.value?.stageBreakdown || []).slice(0, 8).map(item => ({ label: String(item.label || 'Sem etapa'), value: Number(item.total_count || 0) })))
const insightCards = computed(() => [{ label: 'Atividades concluídas', value: numberFormat(report.value?.summary.completedActivityCount), hint: `${numberFormat(report.value?.summary.activityCount)} atividades registradas` }, { label: 'Negócios vencidos', value: numberFormat(report.value?.summary.overdueOpenCount), hint: 'Em aberto e fora do prazo' }, { label: 'Taxa de perda', value: `${numberFormat(report.value?.summary.lossRate)}%`, hint: `${numberFormat(report.value?.summary.lostCount)} negócios perdidos` }, { label: 'Maior motivo de perda', value: String(report.value?.lossReasons?.[0]?.label || 'Sem dados'), hint: `${numberFormat(report.value?.lossReasons?.[0]?.count)} ocorrências` }])
const visibleCustomFieldTotals = computed(() => Object.entries(report.value?.customFieldTotals || {}).filter(([id]) => displayFieldIds.value.includes(String(id)) && filters.sumFieldIds.includes(String(id))).map(([id, value]) => ({ id, label: fieldLabel(id), value: Number(value) })))
const resetFilters = () => { filters.funnelId = ''; filters.userId = ''; filters.productId = ''; filters.categoryId = ''; filters.sumFieldIds = []; const start = new Date(); start.setMonth(start.getMonth() - 2); start.setDate(1); filters.from = localDateInput(start); filters.to = localDateInput(); report.value = null }
const loadFunnelResources = async () => { if (!filters.funnelId) return; filters.userId = ''; filters.productId = ''; filters.categoryId = ''; await Promise.all([loadUsers(filters.funnelId), refreshProducts(filters.funnelId), refreshCategories(filters.funnelId)]) }
const generate = async () => { if (!filters.funnelId || filters.from > filters.to || resourcesLoading.value) return; await loadReport(filters) }
const exportCsv = () => { if (!report.value) return; const headers = ['Usuário', 'Produto', 'Produção', 'Valor', 'Ganhos', 'Perdidos']; const rows = report.value.rows.map(row => [row.user_name || userName(row.user_id) || 'Não atribuído', row.product_name || productName(row.product_id) || 'Sem produto', row.count ?? row.total ?? 0, row.total_value ?? 0, row.won_count ?? 0, row.lost_count ?? 0]); const csv = [headers, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\n'); const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `relatorio-producao-${filters.from}-${filters.to}.csv`; link.click(); URL.revokeObjectURL(url) }
watch(() => filters.funnelId, async funnelId => { report.value = null; if (funnelId) await loadFunnelResources() })
onMounted(async () => { await Promise.all([refreshFunnels(), refreshCustomFields()]) })
if (import.meta.client && user.value && !['master', 'admin'].includes(user.value.role.toLowerCase())) await navigateTo('/')
</script>

<style scoped>
.label { @apply block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400; }
.control { @apply w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100; }
</style>
