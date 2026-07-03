<template>
  <div class="settings-page space-y-6">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Automações</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Crie regras simples de operação no formato quando, condição e ação.</p>
      </div>
      <NuxtLink to="/configuracoes" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Icon name="mdi:arrow-left" size="16" />
        Configurações
      </NuxtLink>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section class="space-y-4">
        <article v-for="automation in automations" :key="automation.id" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full" :class="automation.active ? 'bg-emerald-500' : 'bg-slate-300'" />
                <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">{{ automation.name }}</h2>
              </div>
              <div class="mt-4 grid gap-3 md:grid-cols-3">
                <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                  <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Quando</p>
                  <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{{ automation.trigger }}</p>
                </div>
                <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                  <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Condição</p>
                  <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{{ automation.condition }}</p>
                </div>
                <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                  <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Ação</p>
                  <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{{ automation.action }}</p>
                </div>
              </div>
            </div>

            <button type="button" class="rounded-xl border px-3 py-2 text-xs font-bold transition" :class="automation.active ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950'" @click="toggleAutomation(automation.id)">
              {{ automation.active ? 'Ativa' : 'Inativa' }}
            </button>
          </div>
        </article>
      </section>

      <aside class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Nova automação</h2>
        <form class="mt-4 space-y-3" @submit.prevent="createAutomation">
          <input v-model="form.name" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Nome da regra" />
          <input v-model="form.trigger" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Quando..." />
          <input v-model="form.condition" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Se..." />
          <textarea v-model="form.action" required rows="3" class="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Então..." />
          <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
            <Icon name="mdi:creation" size="18" />
            Criar automação
          </button>
        </form>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const { automations, addAutomation, toggleAutomation } = useWhitelabelMock()

const form = reactive({
  name: '',
  trigger: '',
  condition: '',
  action: ''
})

const createAutomation = () => {
  addAutomation({ ...form })
  form.name = ''
  form.trigger = ''
  form.condition = ''
  form.action = ''
}
</script>
