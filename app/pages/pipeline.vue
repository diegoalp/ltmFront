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
      <label class="sr-only" for="funnel-selector">Selecionar funil</label>
      <select
        id="funnel-selector"
        v-model="selectedFunnelId"
        class="min-w-56 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        <option v-for="funnel in availableFunnels" :key="funnel.id" :value="funnel.id">
          {{ funnel.name }}
        </option>
      </select>

      <NuxtLink
        to="/"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Icon name="mdi:view-dashboard-outline" size="18" />
        Visão geral
      </NuxtLink>
    </div>
  </header>

  <section class="grid gap-4 md:grid-cols-4">
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Valor no funil</p>
      <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ totalFormatted }}</p>
    </div>
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Negócios</p>
      <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ selectedDeals.length }}</p>
    </div>
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Etapas</p>
      <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ selectedColumns.length }}</p>
    </div>
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Visibilidade</p>
      <p class="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{{ isAdmin ? 'Todos os funis' : 'Funis atribuídos' }}</p>
    </div>
  </section>

  <KanbanBoard
    :columns="selectedColumns"
    :cards-by-column="selectedCardsByColumn"
    :total="selectedTotal"
    @move-card="handleMoveCard"
  />
</template>

<script setup lang="ts">
import KanbanBoard from '~/components/kanban/KanbanBoard.vue'
import type { KanbanColumn } from '~/types/crm'

const { user, isAuthenticated } = useAuthMock()
const { funnels } = useWhitelabelMock()
const { funnelColumns, dealsByFunnel, totalByFunnel, cardsByFunnelColumn, moveDealInFunnel } = useKanbanData()

const isAdmin = computed(() => user.value?.role === 'admin')
const availableFunnels = computed(() => {
  if (isAdmin.value) {
    return funnels.value
  }

  return funnels.value.filter((funnel) => funnel.id === 'comercial')
})

const selectedFunnelId = ref(availableFunnels.value[0]?.id ?? 'comercial')
const selectedFunnel = computed(() => availableFunnels.value.find((funnel) => funnel.id === selectedFunnelId.value))
const selectedColumns = computed(() => funnelColumns(selectedFunnelId.value))
const selectedDeals = computed(() => dealsByFunnel(selectedFunnelId.value))
const selectedTotal = computed(() => totalByFunnel(selectedFunnelId.value))
const selectedCardsByColumn = computed(() => cardsByFunnelColumn(selectedFunnelId.value))

const totalFormatted = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(selectedTotal.value)
})

watch(availableFunnels, (value) => {
  if (!value.some((funnel) => funnel.id === selectedFunnelId.value)) {
    selectedFunnelId.value = value[0]?.id ?? 'comercial'
  }
})

const handleMoveCard = (cardId: number, stage: KanbanColumn['id']) => {
  moveDealInFunnel(cardId, selectedFunnelId.value, String(stage))
}

if (import.meta.client && !isAuthenticated.value) {
  await navigateTo('/login')
}
</script>
