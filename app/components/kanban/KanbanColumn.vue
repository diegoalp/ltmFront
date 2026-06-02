<template>
  <section class="flex h-full min-h-[420px] w-[280px] shrink-0 flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
    <header class="mb-3 flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ column.title }}</h3>
      <span class="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
        {{ cards.length }}/{{ column.limit }}
      </span>
    </header>

    <div class="space-y-2">
      <KanbanCard v-for="card in cards" :key="card.id" :card="card" />
      <p v-if="cards.length === 0" class="rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
        No opportunities in this stage.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DealCard, KanbanColumn as ColumnType } from '~/types/crm'
import KanbanCard from '~/components/kanban/KanbanCard.vue'

defineProps<{
  column: ColumnType
  cards: DealCard[]
}>()
</script>
