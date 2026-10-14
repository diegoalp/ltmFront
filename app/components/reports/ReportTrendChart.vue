<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-start justify-between gap-3">
      <div><h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ title }}</h3><p v-if="subtitle" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ subtitle }}</p></div>
      <span class="material-icons text-indigo-400">show_chart</span>
    </div>
    <div v-if="points.length" class="mt-5">
      <div class="relative h-56">
        <div class="pointer-events-none absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400"><span>{{ format(maxValue) }}</span><span>{{ format(maxValue / 2) }}</span><span>0</span></div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="ml-9 h-44 w-[calc(100%-2.25rem)] overflow-visible">
          <defs><linearGradient id="report-trend-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#6366f1" stop-opacity=".3" /><stop offset="100%" stop-color="#6366f1" stop-opacity="0" /></linearGradient></defs>
          <path :d="areaPath" fill="url(#report-trend-fill)" />
          <polyline :points="linePoints" fill="none" stroke="#6366f1" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" vector-effect="non-scaling-stroke" />
          <circle v-for="point in points" :key="point.label" :cx="point.x" :cy="point.y" r="1.8" fill="#fff" stroke="#6366f1" stroke-width="1.2" vector-effect="non-scaling-stroke"><title>{{ point.label }}: {{ format(point.value) }}</title></circle>
        </svg>
      </div>
      <div class="ml-9 flex justify-between gap-2 text-[10px] text-slate-400"><span v-for="point in axisPoints" :key="point.label">{{ point.label }}</span></div>
      <div class="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400"><span class="inline-flex items-center gap-2"><i class="h-2 w-2 rounded-full bg-indigo-500" />{{ legend }}</span><strong class="text-slate-800 dark:text-slate-200">{{ format(total) }} no período</strong></div>
    </div>
    <div v-else class="flex h-48 items-center justify-center text-xs text-slate-400">Sem dados para o período.</div>
  </section>
</template>

<script setup lang="ts">
interface TrendItem { label: string, value: number }
const props = withDefaults(defineProps<{ title: string, subtitle?: string, items: TrendItem[], legend?: string, formatValue?: (value: number) => string }>(), { legend: 'Negócios' })
const maxValue = computed(() => Math.max(1, ...props.items.map(item => item.value)))
const points = computed(() => props.items.map((item, index) => ({ ...item, x: props.items.length === 1 ? 50 : (index / (props.items.length - 1)) * 100, y: 100 - (item.value / maxValue.value) * 92 })))
const linePoints = computed(() => points.value.map(point => `${point.x},${point.y}`).join(' '))
const areaPath = computed(() => points.value.length ? `M ${points.value[0].x} 100 L ${points.value.map(point => `${point.x} ${point.y}`).join(' L ')} L ${points.value.at(-1)?.x} 100 Z` : '')
const axisPoints = computed(() => points.value.filter((_, index) => index === 0 || index === points.value.length - 1 || index === Math.floor(points.value.length / 2)))
const total = computed(() => props.items.reduce((sum, item) => sum + item.value, 0))
const format = (value: number) => props.formatValue ? props.formatValue(value) : new Intl.NumberFormat('pt-BR').format(value)
</script>
