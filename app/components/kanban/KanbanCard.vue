<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
    <header class="flex items-start justify-between gap-2">
      <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ card.title }}</h4>
      <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase" :class="priorityClass">
        {{ card.operation.name }}
      </span>
    </header>

    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ card.company }}</p>

    <dl class="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
      <div class="flex items-center justify-between">
        <dd>{{ card.ownerName }}</dd>
      </div>
      <div class="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
        <dd>{{ formatCurrency(card.value) }}</dd>
      </div>
    </dl>
  </article>
</template>

<script setup lang="ts">
import type { DealCard } from '~/types/crm'

const props = defineProps<{ card: DealCard }>()

const priorityClass = computed(() => {
  if (props.card.priority === 'high') {
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
  }

  if (props.card.priority === 'medium') {
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  }

  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(value)
}

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric' }).format(new Date(value))
}
</script>
