<template>
  <section
    class="flex h-[calc(100vh-220px)] min-h-[520px] max-h-[760px] w-[280px] shrink-0 flex-col rounded-xl border-t-[3px] bg-slate-200/70 p-2 shadow-sm dark:bg-slate-800/70"
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
        {{ total ?? cards.length }}
      </span>

    </header>

    <Draggable
      ref="scrollContainer"
      v-model="localCards"
      class="flex-1 space-y-2 overflow-y-auto pr-1"
      item-key="id"
      group="kanban-deals"
      :animation="180"
      :move="canMove"
      filter=".business-disabled"
      ghost-class="opacity-40"
      drag-class="rotate-1"
      @scroll.passive="handleScroll"
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
          Nenhuma oportunidade nesta etapa.
        </p>
        <div ref="loadMoreSentinel" class="h-1" aria-hidden="true" />
        <p
          v-if="loading"
          class="py-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400"
        >
          Carregando...
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
  loading?: boolean
  hasMore?: boolean
  total?: number
}>()

const emit = defineEmits<{
  (event: 'move-card', cardId: number, stage: ColumnType['id']): void
  (event: 'load-more', stage: ColumnType['id']): void
}>()

const { isDealDisabled } = useBusinessExpiration()
const canMove = (event: { draggedContext: { element: DealCard } }) => !isDealDisabled(event.draggedContext.element)
const localCards = ref<DealCard[]>([])
const scrollContainer = ref<{ $el?: HTMLElement } | HTMLElement | null>(null)
const loadMoreSentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
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

const requestNextPage = () => {
  if (!props.hasMore || props.loading) return
  emit('load-more', props.column.id)
}

const scrollElement = () => {
  const element = scrollContainer.value
  return element && '$el' in element ? element.$el : element
}

const handleScroll = () => {
  const element = scrollElement()
  if (!element) return
  const threshold = 48
  if (element.scrollTop + element.clientHeight >= element.scrollHeight - threshold) {
    requestNextPage()
  }
}

onMounted(() => {
  if (!import.meta.client || !loadMoreSentinel.value) return
  observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) requestNextPage()
  }, {
    root: scrollElement(),
    rootMargin: '120px 0px'
  })
  observer.observe(loadMoreSentinel.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>
