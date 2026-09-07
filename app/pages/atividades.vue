<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Calendário de atividades</h1>
        <p class="mt-1 text-sm text-slate-500">Agende atividades na página do negócio e acompanhe os compromissos aqui.</p>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" class="calendar-button" aria-label="Mês anterior" @click="changeMonth(-1)"><Icon name="lucide:chevron-left" /></button>
        <button type="button" class="calendar-button" @click="goToday">Hoje</button>
        <button type="button" class="calendar-button" aria-label="Próximo mês" @click="changeMonth(1)"><Icon name="lucide:chevron-right" /></button>
      </div>
    </header>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-lg font-semibold capitalize">{{ monthLabel }}</h2>
      <p class="text-sm text-slate-500">{{ activities.length }} atividade(s) no mês</p>
    </div>
    <p v-if="error" role="alert" class="rounded-xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ error }} <button class="underline" @click="load">Tentar novamente</button></p>
    <p v-if="loading" role="status" class="text-sm text-slate-500">Carregando atividades...</p>
    <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" :aria-busy="loading">
      <div class="min-w-[650px]">
        <div class="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
          <span v-for="day in weekdays" :key="day" class="p-3 text-center text-xs font-bold text-slate-500">{{ day }}</span>
        </div>
        <div class="grid grid-cols-7">
          <div v-for="(cell, index) in cells" :key="index" class="min-h-28 border-b border-r border-slate-100 p-2 dark:border-slate-800" :class="cell ? '' : 'bg-slate-50 dark:bg-slate-950/40'">
            <template v-if="cell">
              <button type="button" :aria-pressed="selectedDay === cell.key" :aria-label="`Ver atividades de ${cell.date.toLocaleDateString('pt-BR')}`"
                class="mb-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold"
                :class="selectedDay === cell.key ? 'bg-indigo-600 text-white' : cell.key === todayKey ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-300'"
                @click="selectedDay = cell.key">{{ cell.date.getDate() }}</button>
              <button v-for="activity in byDay[cell.key] || []" :key="activity.id" type="button"
                class="mb-1 block w-full rounded-md px-2 py-1 text-left text-xs"
                :class="activity.status === 'completed' ? 'bg-emerald-50 text-emerald-700 line-through dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200'"
                @click="selectedDay = cell.key">
                <span class="font-semibold">{{ time(activity.scheduled_at) }}</span> <span class="break-words">{{ activity.title }}</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 class="font-bold">Atividades de {{ selectedLabel }}</h2>
      <p v-if="!selectedActivities.length" class="mt-3 text-sm text-slate-500">Nenhuma atividade neste dia.</p>
      <ul v-else class="mt-4 grid gap-4 md:grid-cols-2">
        <li v-for="activity in selectedActivities" :key="activity.id" class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-semibold" :class="{ 'line-through text-slate-400': activity.status === 'completed' }">{{ time(activity.scheduled_at) }} · {{ activity.title }}</h3>
            <span class="text-xs" :class="activity.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'">{{ activity.status === 'completed' ? 'Concluída' : 'Pendente' }}</span>
          </div>
          <p class="mt-2 text-xs text-slate-500">{{ activity.activity_type?.activity_type }} · {{ activity.user?.name }}</p>
          <p v-if="activity.description" class="mt-3 whitespace-pre-wrap text-sm">{{ activity.description }}</p>
          <div class="mt-4 flex items-center justify-between gap-3">
            <NuxtLink :to="`/negocio/${activity.business_id}`" class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{{ activity.business_name || 'Abrir negócio' }}</NuxtLink>
            <button v-if="activity.status === 'pending'" type="button" :disabled="busy === activity.id" class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50" @click="complete(activity.id)">Marcar como concluída</button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
<script setup lang="ts">
import type { ApiActivity } from '~/types/api'
const { listMonth, completeActivity, revision } = useActivities()
const session = useSessionStore()
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const todayKey = ref(dateKey(new Date()))
const month = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const selectedDay = ref(todayKey.value)
const activities = ref<ApiActivity[]>([])
const loading = ref(false)
const error = ref('')
const busy = ref<number | null>(null)
const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const monthLabel = computed(() => new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(month.value))
const selectedLabel = computed(() => new Date(selectedDay.value + 'T12:00:00').toLocaleDateString('pt-BR'))
const time = (value: string) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
const byDay = computed(() => {
  const result: Record<string, ApiActivity[]> = {}
  for (const activity of activities.value) (result[dateKey(new Date(activity.scheduled_at))] ||= []).push(activity)
  return result
})
const selectedActivities = computed(() => byDay.value[selectedDay.value] || [])
const cells = computed(() => {
  const year = month.value.getFullYear(), index = month.value.getMonth()
  const days = new Date(year, index + 1, 0).getDate()
  const offset = month.value.getDay()
  return Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, i) => {
    if (i < offset || i >= offset + days) return null
    const date = new Date(year, index, i - offset + 1)
    return { date, key: dateKey(date) }
  })
})
let generation = 0
const load = async () => {
  const current = ++generation
  activities.value = []
  if (!session.instanceId) return
  loading.value = true; error.value = ''
  try {
    const items = await listMonth(month.value, new Date(month.value.getFullYear(), month.value.getMonth() + 1, 1))
    if (current === generation) activities.value = items
  } catch (cause) { if (current === generation) error.value = cause instanceof Error ? cause.message : 'Erro ao carregar atividades.' }
  finally { if (current === generation) loading.value = false }
}
const changeMonth = (delta: number) => {
  month.value = new Date(month.value.getFullYear(), month.value.getMonth() + delta, 1)
  selectedDay.value = dateKey(month.value)
}
const goToday = () => {
  const now = new Date()
  todayKey.value = dateKey(now); selectedDay.value = todayKey.value
  month.value = new Date(now.getFullYear(), now.getMonth(), 1)
}
const complete = async (id: number) => {
  if (busy.value) return
  busy.value = id
  try { await completeActivity(id) } catch { /* useApi displays the error. */ }
  finally { busy.value = null }
}
watch([month, revision, () => session.instanceId, () => session.user?.id], load)
onMounted(load)
</script>
<style scoped>
.calendar-button { @apply rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900; }
</style>
