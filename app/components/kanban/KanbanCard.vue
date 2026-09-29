<template>
  <component :is="disabled ? 'div' : NuxtLink" :to="disabled ? undefined : `/negocio/${card.id}`"
    :aria-disabled="disabled || undefined" :class="disabled ? 'cursor-not-allowed opacity-40' : ''" class="block">
    <article class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <header class="flex items-start justify-between gap-2">
        <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ card.title }}</h4>
        <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full"></span>
            <span class="relative inline-flex rounded-full h-3 w-3" :class="priorityClass"></span>
          </span>
      </header>

      <p v-if="isExpired(card)" class="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400">Expirado</p>
      <p v-else-if="disabled" class="mt-2 text-xs text-slate-500">Bloqueado até regularizar os expirados</p>
      <div class="mt-2 flex flex-wrap gap-1.5">
        <span class="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
          {{ categoryName }}
        </span>
        <span class="rounded-md px-2 py-0.5 text-[10px] font-semibold" :style="productStyle">
          {{ productName }}
        </span>
      </div>

      <dl class="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
        <div class="flex items-center justify-between">
          <dd>{{ card.ownerName }}</dd>
        </div>
        <!-- <div class="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
          <dd>{{ formatCurrency(card.value) }}</dd>
        </div> -->
      </dl>
      <div v-if="checklists.length" class="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div class="flex items-center justify-between gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400"><span class="inline-flex items-center gap-1"><Icon name="mdi:checkbox-marked-outline" size="13" />Checklist</span><span>{{ completedChecklistItems }}/{{ totalChecklistItems }}</span></div>
        <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full bg-emerald-500" :style="{ width: `${checklistCompletionPercent}%` }" /></div>
        <div class="mt-2 max-h-44 space-y-2 overflow-y-auto pr-1" @click.stop>
          <section v-for="checklist in checklists" :key="checklist.id">
            <p class="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">{{ checklist.title }}</p>
            <label v-for="item in checklist.items" :key="item.id" class="flex cursor-pointer items-start gap-2 rounded-md px-1 py-1 text-[11px] transition hover:bg-slate-50 dark:hover:bg-slate-800/70" :class="{ 'opacity-60': isChecklistItemPending(checklist.id, item.id) }">
              <input
                type="checkbox"
                :checked="item.done"
                :disabled="isChecklistItemPending(checklist.id, item.id)"
                class="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                @click.stop
                @change="toggleChecklistItemFromEvent(checklist.id, item.id, $event)"
              />
              <span class="leading-4" :class="item.done ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'">{{ item.label }}<span v-if="item.required" class="ml-0.5 text-rose-500">*</span></span>
            </label>
          </section>
        </div>
      </div>
    </article>
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import type { DealCard } from '~/types/crm'

const props = defineProps<{ card: DealCard }>()
const { isDealDisabled, isExpired } = useBusinessExpiration()
const disabled = computed(() => isDealDisabled(props.card))
const { categoryById } = useCategories()
const { productById } = useProducts()
const checklistBusinessId = computed(() => props.card.id)
const { checklists, load: loadChecklists, toggleItem: toggleChecklistItem, totalItems: totalChecklistItems, completedItems: completedChecklistItems, completionPercent: checklistCompletionPercent } = useBusinessChecklists(checklistBusinessId)
const pendingChecklistItems = ref(new Set<string>())

const categoryName = computed(() => categoryById(props.card.categoryId)?.name ?? 'Sem categoria')
const product = computed(() => productById(props.card.productId))
const productName = computed(() => product.value?.name ?? 'Sem produto')
const productStyle = computed(() => ({
  backgroundColor: product.value?.color ?? '#E2E8F0',
  color: product.value?.color ? productTextColor(product.value.color) : '#334155'
}))

const productTextColor = (hex: string) => {
  const normalized = hex.replace('#', '')
  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)
  return (red * 299 + green * 587 + blue * 114) / 1000 > 150 ? '#0F172A' : '#FFFFFF'
}

const priorityClass = computed(() => {
  if (props.card.priority === 'high') {
    return 'bg-pink-300 text-rose-700 dark:bg-pink-300/70 dark:text-rose-300'
  }

  if (props.card.priority === 'medium') {
    return 'bg-amber-300 text-amber-700 dark:bg-amber-300/70 dark:text-amber-300'
  }

  return 'bg-emerald-300 text-emerald-700 dark:bg-emerald-300/70 dark:text-emerald-300'
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(value)
}

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric' }).format(new Date(value))
}

const checklistItemKey = (checklistId: number, itemId: number) => `${checklistId}:${itemId}`
const isChecklistItemPending = (checklistId: number, itemId: number) => pendingChecklistItems.value.has(checklistItemKey(checklistId, itemId))
const toggleChecklistItemFromEvent = async (checklistId: number, itemId: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const key = checklistItemKey(checklistId, itemId)
  pendingChecklistItems.value = new Set([...pendingChecklistItems.value, key])
  try {
    await toggleChecklistItem(checklistId, itemId, target.checked)
  } catch {
    target.checked = !target.checked
  } finally {
    const next = new Set(pendingChecklistItems.value)
    next.delete(key)
    pendingChecklistItems.value = next
  }
}

onMounted(() => { void loadChecklists() })
</script>
