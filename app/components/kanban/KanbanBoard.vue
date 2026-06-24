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
          v-for="column in columns"
          :key="column.id"
          :column="column"
          :cards="cardsByColumn[column.id]"
          @move-card="handleMoveCard"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { columns, cardsByColumn, totalPipeline, moveDeal } = useKanbanData()

const totalFormatted = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(totalPipeline.value)
})

const handleMoveCard = (cardId: number, stage: 1 | 2 | 3 | 4 | 5 | 6) => {
  moveDeal(cardId, stage)
}
</script>
