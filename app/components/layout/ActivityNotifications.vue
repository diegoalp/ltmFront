<template>
  <div>
    <button type="button" class="relative rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
      :aria-label="`Atividades de hoje: ${pendingToday.length} pendentes`" title="Atividades de hoje" @click="open = true">
      <Icon name="lucide:bell" size="22" />
      <span v-if="pendingToday.length" class="absolute -right-1 -top-1 rounded-full bg-rose-600 px-1.5 text-[10px] font-bold text-white">{{ pendingToday.length }}</span>
    </button>
    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4" @click.self="open = false" @keydown.esc="open = false">
        <section role="dialog" aria-modal="true" aria-labelledby="daily-activities-title" class="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 text-slate-900 shadow-xl dark:bg-slate-900 dark:text-slate-100">
          <div class="flex items-center justify-between gap-3">
            <h2 id="daily-activities-title" class="text-lg font-bold">Atividades de hoje</h2>
            <button type="button" aria-label="Fechar lembrete" class="rounded-lg p-2" @click="open = false"><Icon name="lucide:x" /></button>
          </div>
          <p class="mt-2 text-sm text-slate-500">{{ pendingToday.length }} pendente(s) de {{ todayActivities.length }} atividade(s) hoje.</p>
          <p v-if="todayError" role="alert" class="mt-3 text-sm text-rose-600">{{ todayError }}</p>
          <p v-else-if="todayLoading" class="mt-4 text-sm">Carregando...</p>
          <p v-else-if="!todayActivities.length" class="mt-4 text-sm">Nenhuma atividade para hoje.</p>
          <ul v-else class="mt-4 space-y-3">
            <li v-for="activity in todayActivities" :key="activity.id" class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <p class="font-semibold" :class="{ 'line-through text-slate-400': activity.status === 'completed' }">{{ time(activity.scheduled_at) }} · {{ activity.title }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ activity.activity_type?.activity_type }} · {{ activity.user?.name }}</p>
              <p v-if="activity.description" class="mt-2 whitespace-pre-wrap text-sm">{{ activity.description }}</p>
              <div class="mt-2 flex items-center justify-between gap-3 text-xs">
                <NuxtLink :to="`/negocio/${activity.business_id}`" class="font-semibold text-indigo-600 dark:text-indigo-400" @click="open = false">Abrir negócio</NuxtLink>
                <button v-if="activity.status === 'pending'" type="button" :disabled="busy === activity.id" class="font-semibold text-emerald-600 disabled:opacity-50" @click="complete(activity.id)">Concluir</button>
                <span v-else class="text-emerald-600">Concluída</span>
              </div>
            </li>
          </ul>
          <NuxtLink to="/atividades" class="mt-5 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white" @click="open = false">Abrir calendário</NuxtLink>
        </section>
      </div>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
const session = useSessionStore()
const { todayActivities, pendingToday, todayLoading, todayError, refreshToday, completeActivity } = useActivities()
const seen = useCookie<boolean>('crm-activity-reminder-seen', { sameSite: 'lax' })
const open = ref(false)
const busy = ref<number | null>(null)
const time = (value: string) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
const refresh = async () => {
  if (!session.isAuthenticated || !session.instanceId) return
  if (await refreshToday()) {
    if (!seen.value) {
      seen.value = true
      if (pendingToday.value.length) open.value = true
    }
  }
}
const complete = async (id: number) => {
  if (busy.value) return
  busy.value = id
  try { await completeActivity(id) } catch { /* useApi displays the error. */ }
  finally { busy.value = null }
}
onMounted(() => {
  void refresh()
  window.addEventListener('focus', refresh)
})
onUnmounted(() => { window.removeEventListener('focus', refresh) })
watch(() => [session.instanceId, session.user?.id], () => {
  todayActivities.value = []
  open.value = false
  void refresh()
})
</script>
