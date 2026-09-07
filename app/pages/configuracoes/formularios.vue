<template>
  <div class="settings-page space-y-6">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Formulários de Captação</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Crie entradas públicas para landing pages, indicação, campanhas e portais whitelabel.</p>
      </div>
      <NuxtLink to="/configuracoes" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Icon name="mdi:arrow-left" size="16" />
        Configurações
      </NuxtLink>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section class="grid gap-4 md:grid-cols-2">
        <article v-for="formItem in publicForms" :key="formItem.id" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ formItem.channel }}</span>
              <h2 class="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{{ formItem.name }}</h2>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ formItem.headline }}</p>
            </div>
            <span class="rounded-full px-2.5 py-1 text-xs font-bold" :class="formItem.active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'">
              {{ formItem.active ? 'Ativo' : 'Pausado' }}
            </span>
          </div>

          <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Prévia pública</p>
            <h3 class="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">{{ formItem.headline }}</h3>
            <div class="mt-4 space-y-2">
              <span v-for="field in formItem.fields" :key="field" class="block rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-900 dark:text-slate-300">{{ field }}</span>
            </div>
          </div>
        </article>
      </section>

      <aside class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Novo formulário</h2>
        <form class="mt-4 space-y-3" @submit.prevent="createForm">
          <input v-model="draft.name" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Nome interno" />
          <input v-model="draft.headline" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Título público" />
          <input v-model="draft.channel" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Canal/origem" />
          <select v-model="draft.assignedFunnelId" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950">
            <option v-for="funnel in funnels" :key="funnel.id" :value="funnel.id">{{ funnel.name }}</option>
          </select>
          <textarea v-model="fieldsText" required rows="4" class="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Campos, separados por vírgula" />
          <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
            <Icon name="mdi:web-plus" size="18" />
            Criar formulário
          </button>
        </form>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const { funnels, publicForms, addPublicForm } = useCrmSettings()

const draft = reactive({
  name: '',
  headline: '',
  channel: '',
  assignedFunnelId: funnels.value[0]?.id ?? 'comercial'
})
const fieldsText = ref('Nome, WhatsApp, Email')

const createForm = () => {
  addPublicForm({
    ...draft,
    fields: fieldsText.value.split(',').map((item) => item.trim()).filter(Boolean)
  })

  draft.name = ''
  draft.headline = ''
  draft.channel = ''
  draft.assignedFunnelId = funnels.value[0]?.id ?? 'comercial'
  fieldsText.value = 'Nome, WhatsApp, Email'
}
</script>
