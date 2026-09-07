<template>
  <section
    class="flex h-full min-h-[65vh] w-[280px] shrink-0 flex-col rounded-xl border-t-[3px] bg-slate-200/70 p-2 shadow-sm dark:bg-slate-800/70"
    :style="columnStyle"
  >
    <header class="mb-3 flex items-center justify-between">
      <div></div>
      <div class="text-center">
        <h3 class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span class="h-2.5 w-2.5 rounded-full shadow-sm" :style="{ backgroundColor: columnColor }" />
          {{ column.title }}
        </h3>
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
      :move="canMove"
      filter=".business-disabled"
      ghost-class="opacity-40"
      drag-class="rotate-1"
      @change="handleChange"
    >
      <template #item="{ element }">
        <KanbanCard :card="element" :class="{ 'business-disabled': isDealDisabled(element) }" />
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
import type { DealCard, KanbanColumn as ColumnType } from '~/types/crm'
import KanbanCard from '~/components/kanban/KanbanCard.vue'

const props = defineProps<{
  column: ColumnType
  cards: DealCard[]
}>()

const emit = defineEmits<{
  (event: 'move-card', cardId: number, stage: ColumnType['id']): void
}>()

const { isDealDisabled } = useBusinessExpiration()
const canMove = (event: { draggedContext: { element: DealCard } }) => !isDealDisabled(event.draggedContext.element)
const localCards = ref<DealCard[]>([])
const columnColor = computed(() => props.column.color || '#64748B')
const columnStyle = computed(() => ({
  borderTopColor: columnColor.value
}))

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
