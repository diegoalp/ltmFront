<template>
  <section class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header class="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800"><div class="flex items-center gap-2"><Icon name="lucide:notebook-pen" class="text-indigo-500" /><h2 class="text-sm font-bold uppercase tracking-wider text-slate-500">Notas</h2></div><span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800">{{ notes.length }}</span></header>
    <form class="border-b border-slate-100 p-4 dark:border-slate-800" @submit.prevent="submit"><textarea v-model.trim="body" rows="3" maxlength="2000" required placeholder="Registre um acontecimento sobre o cliente..." class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950" /><div class="mt-2 flex justify-end"><button type="submit" :disabled="!body || saving" class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"><Icon :name="saving ? 'lucide:loader-circle' : 'lucide:plus'" :class="{ 'animate-spin': saving }" /> Adicionar nota</button></div></form>
    <div class="max-h-80 overflow-y-auto p-4">
      <div v-if="loading" class="py-6 text-center text-xs text-slate-400">Carregando notas...</div>
      <p v-else-if="!notes.length" class="py-6 text-center text-xs text-slate-400">Nenhum acontecimento registrado.</p>
      <div v-else class="space-y-4"><article v-for="note in notes" :key="note.id" class="group flex gap-3"><span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-400" /><div class="min-w-0 flex-1"><p class="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">{{ note.body }}</p><div class="mt-1 flex items-center justify-between gap-2 text-[10px] text-slate-400"><span>{{ note.authorName }} · {{ formatDateTime(note.createdAt) }}</span><button type="button" class="opacity-0 transition hover:text-rose-500 group-hover:opacity-100" @click="remove(note.id)">Excluir</button></div></div></article></div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ businessId: number }>()
const toast = useToast()
const body = ref('')
const businessId = computed(() => props.businessId)
const { notes, loading, saving, loadNotes, addNote, removeNote } = useBusinessNotes(businessId)
const formatDateTime = (value: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
const submit = async () => { if (!body.value) return; await addNote(body.value); body.value = ''; toast.success('Nota adicionada.') }
const remove = async (id: number) => { if (await toast.confirm('A nota será excluída.', { title: 'Excluir nota?', confirmLabel: 'Excluir' })) await removeNote(id) }
onMounted(loadNotes)
watch(businessId, loadNotes)
</script>
