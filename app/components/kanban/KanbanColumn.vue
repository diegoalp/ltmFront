<template>
  <section class="flex h-full min-h-[65vh] w-[280px] shrink-0 flex-col p-2">
    <header class="mb-3 flex items-center justify-between">
      <div></div>
      <div class="text-center">
        <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ column.title }}</h3>
      </div>  
      <span class="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
        {{ cards.length }}
      </span>

    </header>

    <Draggable
      v-model="localCards"
      class="space-y-2"
      item-key="id"
      group="kanban-deals"
      :animation="180"
      ghost-class="opacity-40"
      drag-class="rotate-1"
      @change="handleChange"
    >
      <template #item="{ element }">
        <KanbanCard :card="element" />
      </template>

      <template #footer>
        <p
          v-if="localCards.length === 0"
          class="rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400"
        >
          No opportunities in this stage.
        </p>
      </template>
    </Draggable>
  </section>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { DealCard, DealStage, KanbanColumn as ColumnType } from '~/types/crm'
import KanbanCard from '~/components/kanban/KanbanCard.vue'

const props = defineProps<{
  column: ColumnType
  cards: DealCard[]
}>()

const emit = defineEmits<{
  (event: 'move-card', cardId: number, stage: DealStage): void
}>()

const localCards = ref<DealCard[]>([])

watch(
  () => props.cards,
  (value) => {
    localCards.value = [...value]
  },
  { immediate: true }
)

const handleChange = (event: { added?: { element: DealCard } }) => {
  if (!event.added) {
    return
  }

  emit('move-card', event.added.element.id, props.column.id)
}
</script>
