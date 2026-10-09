<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-start justify-between gap-3"><div><h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ title }}</h3><p v-if="subtitle" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ subtitle }}</p></div><span class="material-icons text-indigo-400">donut_large</span></div>
    <div v-if="total" class="mt-6 flex items-center gap-6"><div class="relative h-36 w-36 shrink-0 rounded-full" :style="donutStyle"><div class="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900"><strong class="text-2xl text-slate-900 dark:text-white">{{ total }}</strong><span class="text-[10px] uppercase tracking-wide text-slate-400">negócios</span></div></div><div class="min-w-0 flex-1 space-y-3"><div v-for="item in items" :key="item.label" class="flex items-center justify-between gap-3 text-xs"><span class="flex min-w-0 items-center gap-2 truncate text-slate-600 dark:text-slate-300"><i class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: item.color }" />{{ item.label }}</span><strong class="text-slate-900 dark:text-white">{{ item.value }}</strong></div></div></div>
    <div v-else class="flex h-40 items-center justify-center text-xs text-slate-400">Sem dados para o período.</div>
  </section>
</template>

<script setup lang="ts">
interface DonutItem { label: string, value: number, color: string }
const props = defineProps<{ title: string, subtitle?: string, items: DonutItem[] }>()
const total = computed(() => props.items.reduce((sum, item) => sum + item.value, 0))
const donutStyle = computed(() => { let cursor = 0; const slices = props.items.map(item => { const start = cursor; cursor += (item.value / total.value) * 360; return `${item.color} ${start}deg ${cursor}deg` }); return { background: `conic-gradient(${slices.join(', ')})` } })
</script>
