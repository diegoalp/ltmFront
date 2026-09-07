<template>
  <main class="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 md:px-6 md:py-10">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(79,70,229,0.10),transparent_26%),radial-gradient(circle_at_88%_75%,rgba(8,145,178,0.09),transparent_28%)] dark:bg-[radial-gradient(circle_at_12%_8%,rgba(99,102,241,0.14),transparent_26%),radial-gradient(circle_at_88%_75%,rgba(8,145,178,0.09),transparent_28%)]" />
    <div class="relative z-10 mx-auto max-w-6xl">
      <header class="mb-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <SMovLogo />
        <div class="flex items-center gap-2">
          <button type="button" class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-sm backdrop-blur transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400" :aria-label="mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'" @click="toggleTheme"><Icon :name="mode === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="h-4.5 w-4.5" /></button>
          <button type="button" class="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400" @click="logout"><Icon name="lucide:log-out" class="h-4 w-4" /> Sair</button>
        </div>
      </header>
      <div class="mb-8"><p class="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-400">{{ isMaster ? 'Área master' : 'Sua conta' }}</p><h1 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{{ isMaster ? 'Escolha uma instância' : 'Crie sua instância' }}</h1><p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">Selecione o ambiente que deseja acessar ou configure uma nova identidade para sua operação.</p></div>

      <section v-if="!showForm" class="rounded-[2rem] border border-white bg-white/90 p-5 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/30 sm:p-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 class="text-lg font-semibold">Instâncias disponíveis</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ instances.length }} {{ instances.length === 1 ? 'ambiente cadastrado' : 'ambientes cadastrados' }}</p></div><button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/25" @click="showForm = true"><Icon name="lucide:plus" class="h-4 w-4" /> Criar instância</button></div>
        <div v-if="loading" class="mt-7 flex items-center gap-3 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500 dark:bg-slate-950/50"><Icon name="lucide:loader-circle" class="h-4 w-4 animate-spin text-indigo-500" /> Carregando instâncias...</div>
        <div v-else-if="instances.length" class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article v-for="instance in instances" :key="instance.id" class="group relative flex flex-wrap items-center gap-2 rounded-2xl border p-2 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-lg dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20" :class="isSelected(instance.id) ? 'border-indigo-400 bg-indigo-50/70 ring-4 ring-indigo-500/10 dark:border-indigo-700 dark:bg-indigo-950/25' : 'border-slate-200 bg-white/50 dark:border-slate-700'">
            <button type="button" :disabled="selecting || deleting || instance.isExpired" class="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-2 text-left disabled:opacity-60" @click="selectInstance(instance.id)"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 font-semibold text-white shadow-md">{{ instance.name.slice(0, 2).toUpperCase() }}</span><span class="min-w-0 flex-1"><span class="block truncate font-semibold">{{ instance.name }}</span><span class="mt-0.5 block text-xs text-slate-400">{{ instance.isExpired ? 'Expirada' : 'Acessar ambiente' }} · {{ formatExpiration(instance.expirationDate) }}</span></span><Icon name="lucide:arrow-right" class="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" /></button>
            <span v-if="isSelected(instance.id)" class="absolute -top-2 left-4 rounded-full bg-indigo-600 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">Selecionada</span>
            <button v-if="isMaster" type="button" :disabled="deleting" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-100 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-rose-950/50" :aria-label="`Remover ${instance.name}`" title="Remover instância" @click="deleteTarget = instance"><Icon name="mdi:trash-can-outline" size="20" /></button>
            <form v-if="isMaster" class="flex w-full flex-wrap items-end gap-2 border-t border-slate-200 p-2 dark:border-slate-700" @submit.prevent="renew(instance.id)">
              <label class="min-w-0 flex-1 text-xs font-semibold">Nova data de expiração
                <input v-model="renewalDates[String(instance.id)]" type="date" required :min="today" class="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-950" />
              </label>
              <button :disabled="renewing === instance.id" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{{ instance.isExpired ? 'Reativar' : 'Atualizar' }}</button>
            </form>
          </article>
        </div>
        <div v-else class="mt-7 rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700"><span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"><Icon name="lucide:building-2" class="h-5 w-5" /></span><p class="mt-4 text-sm font-medium">Nenhuma instância disponível</p><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Crie seu primeiro ambiente para continuar.</p></div>
        <p v-if="error" class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ error }}</p>
      </section>

      <form v-else class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" @submit.prevent="submit">
        <section class="rounded-[2rem] border border-white bg-white/90 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 sm:p-8">
          <div class="flex items-center justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Novo ambiente</p><h2 class="mt-2 text-xl font-semibold">Nova instância</h2></div><button type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800" @click="showForm = false">Cancelar</button></div>
          <label v-if="isMaster" class="mt-5 block text-sm font-semibold">Data de expiração
            <input v-model="expirationDate" type="date" required :min="today" class="mt-1 block rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <p v-else class="mt-5 text-sm text-slate-500">Sua instância terá 7 dias de validade inicial. Após esse prazo, o master poderá renovar o acesso. Você pode criar apenas uma instância.</p>
          <div class="mt-6 grid gap-6 md:grid-cols-[150px_minmax(0,1fr)]">
            <div class="flex flex-col items-center gap-3"><div class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"><img v-if="logoPreview" :src="logoPreview" alt="Prévia do logotipo" class="max-h-full max-w-full object-contain"><span v-else class="flex h-16 w-16 items-center justify-center rounded-xl text-lg font-bold" :style="{ backgroundColor: form.primaryColor, color: form.primaryTextColor }">{{ initials }}</span></div><label class="cursor-pointer rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold dark:border-slate-700">Enviar logo<input class="hidden" type="file" accept="image/*" @change="handleLogo"></label><button v-if="logoPreview" type="button" class="text-xs font-semibold text-rose-600" @click="removePendingLogo">Remover</button></div>
            <div class="space-y-5">
              <label class="block space-y-2"><span class="text-sm font-semibold">Nome da instância</span><input v-model.trim="form.name" required maxlength="255" class="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950/50" placeholder="Ex.: Minha empresa"></label>
              <div class="grid gap-4 sm:grid-cols-2"><label v-for="field in colorFields" :key="field.key" class="space-y-2"><span class="text-sm font-semibold">{{ field.label }}</span><span class="flex overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700"><input v-model="form[field.key]" type="color" class="h-11 w-14 cursor-pointer border-0 bg-transparent p-1"><input v-model="form[field.key]" required pattern="#[0-9a-fA-F]{6}" maxlength="7" class="min-w-0 flex-1 bg-transparent px-3 font-mono text-sm outline-none"></span></label></div>
              <p v-if="logoError" class="text-sm text-rose-600">{{ logoError }}</p><p v-if="error" class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ error }}</p>
              <button type="submit" :disabled="creating" class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-60"><Icon v-if="creating" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />{{ creating ? 'Criando instância...' : 'Criar e acessar instância' }}</button>
            </div>
          </div>
        </section>
        <aside class="rounded-[2rem] border border-white bg-white/90 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85"><p class="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Identidade própria</p><h2 class="mt-2 font-semibold">Prévia da instância</h2><p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Esta aparência será usada dentro do ambiente selecionado.</p><div class="mt-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-950/40"><div class="flex items-center gap-3"><span class="flex h-10 w-10 items-center justify-center rounded-lg font-bold" :style="{ backgroundColor: form.primaryColor, color: form.primaryTextColor }">{{ initials }}</span><strong class="truncate" :style="{ color: form.primaryColor }">{{ form.name || 'Nova instância' }}</strong></div><div class="mt-5 h-2 rounded-full" :style="{ backgroundColor: form.secondaryColor }" /><button type="button" class="mt-4 rounded-lg px-3 py-2 text-xs font-bold" :style="{ backgroundColor: form.accentColor, color: accentTextColor }">Novo lead</button></div></aside>
      </form>
    </div>

    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" @click.self="deleteTarget = null">
      <section class="w-full max-w-md rounded-[2rem] border border-white bg-white p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950"><Icon name="mdi:alert-outline" size="25" /></span>
        <h2 class="mt-4 text-xl font-bold">Remover instância?</h2>
        <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">A instância <strong>{{ deleteTarget.name }}</strong> será removida. Esta ação não pode ser desfeita.</p>
        <div class="mt-6 flex justify-end gap-3"><button type="button" class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold dark:border-slate-700" @click="deleteTarget = null">Cancelar</button><button type="button" :disabled="deleting" class="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-500 disabled:opacity-60" @click="removeInstance">{{ deleting ? 'Removendo...' : 'Remover' }}</button></div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import SMovLogo from '~/components/auth/SMovLogo.vue'

type ColorKey = 'primaryColor' | 'secondaryColor' | 'accentColor' | 'primaryTextColor'
type InstanceItem = { id: string | number, name: string }
definePageMeta({ layout: false })
useHead({ title: 'Instâncias · SMov CRM' })
const { logout, user } = useAuth()
const isMaster = computed(() => user.value?.role === 'master')
const { mode, toggleTheme } = useTheme()
const { instances, instanceId, loading, creating, selecting, deleting, error, loadInstances, selectInstance, createInstance, deleteInstance, activateInstance } = useInstanceContext()
const showForm = ref(user.value?.role !== 'master')
const today = new Date().toLocaleDateString('en-CA')
const expirationDate = ref('')
const renewalDates = reactive<Record<string, string>>({})
const renewing = ref<string | number | null>(null)
const formatExpiration = (value?: string | null) => value ? new Date(value + 'T12:00:00').toLocaleDateString('pt-BR') : 'Sem vencimento definido'
const renew = async (id: string | number) => {
  if (renewing.value) return
  renewing.value = id
  try { await activateInstance(id, renewalDates[String(id)] || '') }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Não foi possível reativar a instância.' }
  finally { renewing.value = null }
}
const deleteTarget = ref<InstanceItem | null>(null)
const logoError = ref('')
const logoPreview = ref<string | null>(null)
const form = reactive({ name: '', logoFile: null as File | null, primaryColor: '#625751', secondaryColor: '#0f766e', accentColor: '#f59e0b', primaryTextColor: '#ffffff' })
const colorFields: Array<{ key: ColorKey, label: string }> = [{ key: 'primaryColor', label: 'Cor principal' }, { key: 'secondaryColor', label: 'Cor secundária' }, { key: 'accentColor', label: 'Cor de destaque' }, { key: 'primaryTextColor', label: 'Texto da cor principal' }]
const initials = computed(() => (form.name || 'NI').slice(0, 2).toUpperCase())
const accentTextColor = computed(() => ['#facc15', '#f59e0b'].includes(form.accentColor.toLowerCase()) ? '#111827' : '#ffffff')
const isSelected = (id: string | number) => String(id) === String(instanceId.value)
const removePendingLogo = () => { if (logoPreview.value) URL.revokeObjectURL(logoPreview.value); logoPreview.value = null; form.logoFile = null }
const handleLogo = (event: Event) => { const input = event.target as HTMLInputElement; const file = input.files?.[0]; logoError.value = ''; if (!file) return; if (!file.type.startsWith('image/')) logoError.value = 'Envie um arquivo de imagem.'; else if (file.size > 1024 * 1024) logoError.value = 'A imagem deve ter no máximo 1 MB.'; else { removePendingLogo(); form.logoFile = file; logoPreview.value = URL.createObjectURL(file) } input.value = '' }
const submit = async () => { if (!form.name.trim() || logoError.value) return; await createInstance({ ...form, name: form.name.trim(), ...(isMaster.value ? { expiration_date: expirationDate.value } : {}) }) }
const removeInstance = async () => { if (!deleteTarget.value) return; if (await deleteInstance(deleteTarget.value.id)) deleteTarget.value = null }
onMounted(loadInstances)
onBeforeUnmount(removePendingLogo)
</script>
