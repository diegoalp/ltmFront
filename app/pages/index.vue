<template>
  <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <p class="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Pipeline</p>
      <h1 class="text-2xl font-semibold md:text-3xl priority-color">{{ selectedFunnel?.name ?? 'Quadro de oportunidades' }}</h1>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {{ selectedFunnel?.description ?? 'Arraste os cards entre etapas, acompanhe valores e acesse o detalhe de cada negócio.' }}
      </p>
    </div>

    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-label="Filtrar negócios por status">
        <button
          type="button"
          class="status-filter-button"
          :class="statusFilter === 'won' ? 'status-filter-button--won-active' : 'status-filter-button--inactive'"
          :aria-pressed="statusFilter === 'won'"
          @click="toggleStatusFilter('won')"
        >
          <Icon name="mdi:trophy-outline" size="17" />
          Ganhos
        </button>
        <button
          type="button"
          class="status-filter-button"
          :class="statusFilter === 'lost' ? 'status-filter-button--lost-active' : 'status-filter-button--inactive'"
          :aria-pressed="statusFilter === 'lost'"
          @click="toggleStatusFilter('lost')"
        >
          <Icon name="mdi:close-circle-outline" size="17" />
          Perdidos
        </button>
      </div>
      <button type="button" :disabled="!availableFunnels.length || hasExpiredDeals" class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50" @click="newBusinessOpen = true"><Icon name="mdi:plus" size="18" />Novo negócio</button>
      <label v-if="canChooseFunnel" class="sr-only" for="funnel-selector">Selecionar funil</label>
      <select
        v-if="canChooseFunnel"
        id="funnel-selector"
        v-model="selectedFunnelId"
        class="min-w-56 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        <option disabled value="">Selecione um funil</option>
        <option v-for="funnel in availableFunnels" :key="funnel.id" :value="funnel.id">
          {{ funnel.name }}
        </option>
      </select>
      <span v-else-if="selectedFunnel" class="inline-flex min-w-56 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <Icon name="mdi:lock-outline" size="17" />
        {{ selectedFunnel.name }}
      </span>

      <NuxtLink
        to="/"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Icon name="mdi:view-dashboard-outline" size="18" />
        Visão geral
      </NuxtLink>
    </div>
  </header>

  <div v-if="!settingsLoading && settingsError && availableFunnels.length === 0" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
    {{ settingsError }}
  </div>

  <div v-else-if="!settingsLoading && !selectedFunnel && availableFunnels.length === 0" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
    Nenhum funil está disponível para esta instância. Solicite a configuração de um funil antes de montar o pipeline.
  </div>

  <!-- <section class="grid gap-4 md:grid-cols-4">
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Valor no funil</p>
      <p class="mt-2 text-xl font-medium text-slate-900 dark:text-slate-100">{{ totalFormatted }}</p>
    </div>
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Negócios</p>
      <p class="mt-2 text-xl font-medium text-slate-900 dark:text-slate-100">{{ selectedDeals.length }}</p>
    </div>
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Etapas</p>
      <p class="mt-2 text-xl font-medium text-slate-900 dark:text-slate-100">{{ selectedColumns.length }}</p>
    </div>
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Visibilidade</p>
      <p class="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{{ isAdmin ? 'Todos os funis' : 'Funis atribuídos' }}</p>
    </div>
  </section> -->

  <KanbanBoard
    :columns="selectedColumns"
    :cards-by-column="selectedCardsByColumn"
    :column-states="selectedColumnStates"
    :total="selectedTotal"
    @move-card="handleMoveCard"
    @load-more="handleLoadMore"
  />
  <NewBusinessModal :open="newBusinessOpen && !hasExpiredDeals" :initial-funnel-id="selectedFunnelId" @close="newBusinessOpen = false" />
</template>

<script setup lang="ts">
import KanbanBoard from '~/components/kanban/KanbanBoard.vue'
import NewBusinessModal from '~/components/business/NewBusinessModal.vue'
import type { DealCard, KanbanColumn } from '~/types/crm'

const { user, isAuthenticated } = useAuth()
const { instanceId } = useApi()
const { funnels, funnelsLoading: settingsLoading, funnelsError: settingsError } = useFunnels()
const { funnelColumns, dealsByFunnel, moveDealInFunnel, refreshDeals, loadNextStagePage, stagePageState, stageHasMore } = useKanbanData()
const { hasExpiredDeals } = useBusinessExpiration()
const newBusinessOpen = ref(false)
type StatusFilter = NonNullable<Exclude<DealCard['status'], 'active'>>
const statusFilter = ref<StatusFilter | null>(null)

const isAdmin = computed(() => user.value?.role === 'admin')
const assignedFunnelId = computed(() => user.value?.funnelId == null ? '' : String(user.value.funnelId))
const canChooseFunnel = computed(() => !assignedFunnelId.value)
const availableFunnels = computed(() => {
  if (!assignedFunnelId.value) return funnels.value
  return funnels.value.filter(funnel => funnel.id === assignedFunnelId.value)
})

// Keep an independent funnel selection for each tenant.
const persistedFunnelId = useCookie<string | null>(`crm-funnel-id-${instanceId.value || 'default'}`, {
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 90
})
const selectedFunnelId = ref(assignedFunnelId.value || persistedFunnelId.value || '')
const selectionReady = ref(false)
const selectedFunnel = computed(() => availableFunnels.value.find((funnel) => funnel.id === selectedFunnelId.value))
const selectedColumns = computed(() => funnelColumns(selectedFunnelId.value))
const selectedStageIds = computed(() => selectedColumns.value.map(column => String(column.id)))
const selectedDeals = computed(() => dealsByFunnel(selectedFunnelId.value))
const selectedTotal = computed(() => selectedDeals.value.reduce((sum, card) => sum + card.value, 0))
const selectedCardsByColumn = computed(() => Object.fromEntries(
  selectedColumns.value.map(column => [String(column.id), selectedDeals.value.filter(card => card.funnelStageId === String(column.id))])
))
const selectedColumnStates = computed(() => Object.fromEntries(
  selectedColumns.value.map(column => {
    const state = stagePageState(column.id)
    return [String(column.id), {
      loading: state.loading,
      hasMore: stageHasMore(column.id),
      total: state.loaded ? state.total : (selectedCardsByColumn.value[String(column.id)]?.length ?? 0)
    }]
  })
))

const totalFormatted = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(selectedTotal.value)
})

watch([availableFunnels, settingsLoading], ([value, loading]) => {
  // An empty list while settings are loading must not erase the persisted ID.
  if (loading) return
  if (assignedFunnelId.value) {
    selectedFunnelId.value = assignedFunnelId.value
  } else if (!value.some((funnel) => funnel.id === selectedFunnelId.value)) {
    selectedFunnelId.value = value[0]?.id ?? ''
  }
  selectionReady.value = true
}, { immediate: true })

watch(selectedFunnelId, (value) => {
  if (selectionReady.value && canChooseFunnel.value) persistedFunnelId.value = value || null
}, { flush: 'sync' })

const refreshSelectedFunnel = async () => {
  if (!selectionReady.value || !instanceId.value || !selectedFunnelId.value || !selectedStageIds.value.length) return
  await refreshDeals({
    funnelId: selectedFunnelId.value,
    stageIds: selectedStageIds.value,
    status: statusFilter.value
  })
}

watch([selectionReady, selectedFunnelId, selectedStageIds, statusFilter], () => {
  void refreshSelectedFunnel()
}, { immediate: true })

const handleMoveCard = (cardId: number, stage: KanbanColumn['id']) => {
  if (!selectedFunnelId.value) return
  moveDealInFunnel(cardId, selectedFunnelId.value, String(stage))
}

const handleLoadMore = (stage: KanbanColumn['id']) => {
  if (!selectedFunnelId.value) return
  void loadNextStagePage(stage, {
    funnelId: selectedFunnelId.value,
    status: statusFilter.value
  })
}

const toggleStatusFilter = (status: StatusFilter) => {
  statusFilter.value = statusFilter.value === status ? null : status
}

if (import.meta.client && !isAuthenticated.value) {
  await navigateTo('/login')
}

</script>

<style scoped>
.status-filter-button {
  @apply inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition;
}
.status-filter-button--inactive {
  @apply bg-transparent text-slate-400 opacity-60 hover:bg-slate-100 hover:text-slate-600 hover:opacity-100 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300;
}
.status-filter-button--won-active {
  @apply bg-emerald-600 text-white opacity-100 shadow-sm shadow-emerald-600/25;
}
.status-filter-button--lost-active {
  @apply bg-rose-600 text-white opacity-100 shadow-sm shadow-rose-600/25;
}
</style>
