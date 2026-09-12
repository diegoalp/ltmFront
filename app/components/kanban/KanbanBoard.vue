<template>
  <section class="space-y-4">
    <header class="flex items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Pipeline total</p>
        <h3 class="text-md font-medium text-slate-900 dark:text-slate-100">Arraste os cards entre as etapas</h3>
      </div>

      <p class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        {{ totalFormatted }}
      </p>
    </header>

    <div class="overflow-x-auto pb-2">
      <div class="flex min-w-max gap-3">
        <KanbanColumn 
          class="rounded-lg p-3"
          v-for="column in boardColumns"
          :key="column.id"
          :column="column"
          :cards="boardCardsByColumn[String(column.id)] ?? []"
          :loading="columnState(column.id).loading"
          :has-more="columnState(column.id).hasMore"
          :total="columnState(column.id).total"
          @move-card="handleMoveCard"
          @load-more="handleLoadMore"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DealCard, KanbanColumn } from '~/types/crm'

const props = withDefaults(defineProps<{
  columns?: KanbanColumn[]
  cardsByColumn?: Record<string, DealCard[]>
  columnStates?: Record<string, { loading: boolean, hasMore: boolean, total: number }>
  total?: number
}>(), {
  columns: undefined,
  cardsByColumn: undefined,
  columnStates: undefined,
  total: undefined
})

const emit = defineEmits<{
  (event: 'move-card', cardId: number, stage: KanbanColumn['id']): void
  (event: 'load-more', stage: KanbanColumn['id']): void
}>()

const { columns, cardsByColumn, totalPipeline, moveDeal, stagePageState, stageHasMore, loadNextStagePage } = useKanbanData()

const boardColumns = computed(() => props.columns ?? columns.value)

const boardCardsByColumn = computed<Record<string, DealCard[]>>(() => {
  if (props.cardsByColumn) {
    return props.cardsByColumn
  }

  return Object.fromEntries(Object.entries(cardsByColumn.value).map(([key, value]) => [String(key), value]))
})

const boardTotal = computed(() => props.total ?? totalPipeline.value)

const totalFormatted = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(boardTotal.value)
})

const handleMoveCard = (cardId: number, stage: KanbanColumn['id']) => {
  emit('move-card', cardId, stage)

  if (props.columns) {
    return
  }

  moveDeal(cardId, stage as 1 | 2 | 3 | 4 | 5 | 6)
}

const columnState = (stage: KanbanColumn['id']) => {
  const key = String(stage)
  if (props.columnStates?.[key]) return props.columnStates[key]
  const state = stagePageState(stage)
  return {
    loading: state.loading,
    hasMore: stageHasMore(stage),
    total: state.loaded ? state.total : (boardCardsByColumn.value[key]?.length ?? 0)
  }
}

const handleLoadMore = (stage: KanbanColumn['id']) => {
  emit('load-more', stage)

  if (props.columns) {
    return
  }

  void loadNextStagePage(stage)
}
</script>
