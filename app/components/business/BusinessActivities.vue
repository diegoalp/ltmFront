<template>
  <section class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header class="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800"><div class="flex items-center gap-2"><Icon name="lucide:calendar-clock" class="text-cyan-600" /><h2 class="text-sm font-bold uppercase tracking-wider text-slate-500">Atividades</h2></div><button type="button" class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900" @click="showForm = !showForm">{{ showForm ? 'Cancelar' : '+ Agendar' }}</button></header>
    <form v-if="showForm" class="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-2 dark:border-slate-800" @submit.prevent="submit">
      <label class="space-y-1"><span class="text-xs font-semibold">Tipo</span><select v-model.number="form.activityTypeId" required class="field"><option :value="0" disabled>Selecione</option><option v-for="type in activeTypes" :key="type.id" :value="type.id">{{ type.name }}</option></select></label>
      <label class="space-y-1 sm:col-span-2"><span class="text-xs font-semibold">Responsável pela atividade</span>
        <select v-model.number="form.userId" required :disabled="assigneesLoading" class="field">
          <option :value="0" disabled>Selecione o responsável</option>
          <option v-for="assignee in assignees" :key="assignee.id" :value="assignee.id">{{ assignee.name }}{{ String(assignee.id) === String(user?.id) ? ' (você)' : '' }}</option>
        </select>
        <span v-if="assigneesLoading" class="text-xs text-slate-500">Carregando responsáveis...</span>
        <span v-else-if="assigneesError" role="alert" class="text-xs text-rose-600">{{ assigneesError }}</span>
      </label>
      <label class="space-y-1"><span class="text-xs font-semibold">Data e hora</span><input v-model="form.scheduledAt" type="datetime-local" required class="field" /></label>
      <label class="space-y-1 sm:col-span-2"><span class="text-xs font-semibold">Assunto</span><input v-model.trim="form.title" maxlength="150" required class="field" placeholder="Ex.: Retornar com a proposta" /></label>
      <label class="space-y-1 sm:col-span-2"><span class="text-xs font-semibold">Descrição</span><textarea v-model.trim="form.description" rows="2" maxlength="1000" class="field resize-none" placeholder="Detalhes opcionais" /></label>
      <button type="submit" :disabled="saving || assigneesLoading || !assignees.some(item => item.id === form.userId)" class="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50 sm:col-span-2">{{ saving ? 'Agendando...' : 'Agendar atividade' }}</button>
    </form>
    <div class="max-h-96 overflow-y-auto p-4"><p v-if="loading" class="py-6 text-center text-xs text-slate-400">Carregando atividades...</p><p v-else-if="!activities.length" class="py-6 text-center text-xs text-slate-400">Nenhuma atividade agendada.</p><div v-else class="space-y-3"><article v-for="activity in activities" :key="activity.id" class="rounded-xl border border-slate-100 p-3 dark:border-slate-800" :class="{ 'opacity-60': activity.status !== 'pending' }"><div class="flex items-start gap-3"><span class="mt-1 h-3 w-3 shrink-0 rounded-full" :style="{ backgroundColor: activity.activityTypeColor }" /><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center justify-between gap-2"><p class="text-sm font-semibold" :class="{ 'line-through': activity.status === 'completed' }">{{ activity.title }}</p><span class="text-[10px] font-semibold text-slate-400">{{ activity.activityTypeName }}</span></div><p class="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">{{ formatDateTime(activity.scheduledAt) }}</p><p v-if="activity.description" class="mt-2 text-xs leading-5 text-slate-500">{{ activity.description }}</p><div class="mt-3 flex items-center justify-between"><span class="text-[10px] text-slate-400">{{ activity.ownerName }}</span><div class="flex gap-2"><button v-if="activity.status === 'pending'" type="button" class="text-[10px] font-semibold text-emerald-600" @click="setStatus(activity.id, 'completed')">Concluir</button><button type="button" class="text-[10px] font-semibold text-rose-500" @click="remove(activity.id)">Excluir</button></div></div></div></div></article></div></div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ businessId: number, funnelId?: string }>()
const toast = useToast()
const { user } = useAuth()
const showForm = ref(false)
const form = reactive({ activityTypeId: 0, userId: 0, scheduledAt: '', title: '', description: '' })
const businessId = computed(() => props.businessId)
const { activityTypes, loadActivityTypes } = useActivityTypes()
const activeTypes = computed(() => activityTypes.value.filter(item => item.active && (!item.funnelIds.length || item.funnelIds.includes(props.funnelId || ''))))
const { assignees, assigneesLoading, assigneesError, loadAssignees, activities, loading, saving, loadActivities, addActivity, setStatus, removeActivity } = useBusinessActivities(businessId)
const formatDateTime = (value: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
const submit = async () => { await addActivity({ title: form.title, description: form.description || undefined, scheduled_at: form.scheduledAt, activity_type_id: form.activityTypeId, user_id: form.userId }); Object.assign(form, { activityTypeId: 0, userId: 0, scheduledAt: '', title: '', description: '' }); showForm.value = false; toast.success('Atividade agendada.') }
const remove = async (id: number) => { if (await toast.confirm('A atividade será excluída.', { title: 'Excluir atividade?', confirmLabel: 'Excluir' })) await removeActivity(id) }
onMounted(() => Promise.all([loadActivities(), loadActivityTypes()]))
watch(businessId, () => { showForm.value = false; void loadActivities() })
watch(showForm, open => { if (open) void loadAssignees() })
watch(assignees, items => {
  if (items.some(item => item.id === form.userId)) return
  form.userId = items.find(item => String(item.id) === String(user.value?.id))?.id || 0
})
</script>

<style scoped>
.field { @apply w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950; }
</style>
