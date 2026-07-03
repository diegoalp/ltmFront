<template>
  <div class="settings-page space-y-6">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Múltiplos Funis</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Modele fluxos diferentes para venda, backoffice, suporte, cobrança, renovação ou pós-venda.</p>
      </div>
      <NuxtLink to="/configuracoes" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Icon name="mdi:arrow-left" size="16" />
        Configurações
      </NuxtLink>
    </div>

    <div class="grid gap-5 lg:grid-cols-3">
      <section v-for="funnel in funnels" :key="funnel.id" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-3">
          <div>
            <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              <span class="h-2.5 w-2.5 rounded-full" :class="funnel.colorClass" />
              {{ funnel.ownerTeam }}
            </span>
            <h2 class="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{{ funnel.name }}</h2>
            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ funnel.description }}</p>
          </div>
          <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">Ativo</span>
        </div>

        <ol class="mt-5 space-y-3">
          <li v-for="(stage, index) in funnel.stages" :key="stage.title" class="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">{{ index + 1 }}</span>
            <div>
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ stage.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">SLA: {{ stage.expirationLabel }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/50">
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Novo funil rápido</h2>
        <form class="mt-4 space-y-3" @submit.prevent="createFunnel">
          <input v-model="form.name" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Nome do funil" />
          <input v-model="form.ownerTeam" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Equipe responsável" />
          <textarea v-model="form.description" required rows="3" class="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Descrição curta" />
          <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
            <Icon name="mdi:plus" size="18" />
            Criar com etapas padrão
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { funnels, addFunnel } = useWhitelabelMock()

const form = reactive({
  name: '',
  ownerTeam: '',
  description: ''
})

const createFunnel = () => {
  addFunnel({
    name: form.name,
    ownerTeam: form.ownerTeam,
    description: form.description,
    colorClass: 'bg-amber-500',
    stages: [
      { title: 'Entrada', expirationLabel: '1 dia' },
      { title: 'Em andamento', expirationLabel: '2 dias' },
      { title: 'Validação', expirationLabel: '1 dia' },
      { title: 'Concluído', expirationLabel: 'Sem expiração' }
    ]
  })

  form.name = ''
  form.ownerTeam = ''
  form.description = ''
}
</script>
