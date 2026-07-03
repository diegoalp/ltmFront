<template>
  <section class="space-y-4">
    <header class="flex items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Pipeline total</p>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Arraste os cards entre as etapas</h2>
      </div>

      <p class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        {{ totalFormatted }}
      </p>
    </header>

    <div class="overflow-x-auto pb-2">
      <div class="flex min-w-max gap-3">
        <KanbanColumn 
          class="bg-slate-200/50 dark:bg-slate-800 rounded-lg p-3"
          v-for="column in boardColumns"
          :key="column.id"
          :column="column"
          :cards="boardCardsByColumn[String(column.id)] ?? []"
          @move-card="handleMoveCard"
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
  total?: number
}>(), {
  columns: undefined,
  cardsByColumn: undefined,
  total: undefined
})

const emit = defineEmits<{
  (event: 'move-card', cardId: number, stage: KanbanColumn['id']): void
}>()

const { columns, cardsByColumn, totalPipeline, moveDeal } = useKanbanData()

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
</script>
