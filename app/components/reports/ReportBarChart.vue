<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-start justify-between gap-3"><div><h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ title }}</h3><p v-if="subtitle" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ subtitle }}</p></div><span class="material-icons text-indigo-400">bar_chart</span></div>
    <div v-if="!items.length" class="flex h-48 items-center justify-center text-xs text-slate-400">Sem dados para o período.</div>
    <div v-else class="mt-5 space-y-4">
      <div v-for="item in items" :key="item.label" class="space-y-1.5">
        <div class="flex items-center justify-between gap-3 text-xs"><span class="min-w-0 truncate font-semibold text-slate-700 dark:text-slate-200">{{ item.label }}</span><span class="shrink-0 font-bold text-slate-900 dark:text-white">{{ format(item.value) }}</span></div>
        <div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700" :style="{ width: `${width(item.value)}%` }" /></div>
        <div v-if="item.secondaryValue !== undefined" class="flex items-center justify-between gap-2 text-[11px] text-slate-400"><span class="inline-flex items-center gap-1"><i class="h-1.5 w-1.5 rounded-full bg-rose-400" />{{ secondaryLabel }}</span><span>{{ format(item.secondaryValue) }}</span></div>
        <div v-if="item.secondaryValue !== undefined" class="h-1.5 overflow-hidden rounded-full bg-rose-100 dark:bg-rose-950/40"><div class="h-full rounded-full bg-rose-400 transition-all duration-700" :style="{ width: `${width(item.secondaryValue)}%` }" /></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface ChartItem { label: string, value: number, secondaryValue?: number }
const props = withDefaults(defineProps<{ title: string, subtitle?: string, items: ChartItem[], secondaryLabel?: string, formatValue?: (value: number) => string }>(), { secondaryLabel: 'Perdidos' })
const max = computed(() => Math.max(1, ...props.items.flatMap(item => [item.value, item.secondaryValue || 0])))
const width = (value: number) => Math.max(value > 0 ? 4 : 0, (value / max.value) * 100)
const format = (value: number) => props.formatValue ? props.formatValue(value) : new Intl.NumberFormat('pt-BR').format(value)
</script>
