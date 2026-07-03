<template>
        <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Operação whitelabel</p>
            <h1 class="text-2xl font-semibold md:text-3xl priority-color">CRM Kanban</h1>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Acompanhe oportunidades, funis, tarefas e automações com dados mock enquanto a integração de API não foi iniciada.
            </p>
          </div>

          <NuxtLink
            to="/configuracoes/templates"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Icon name="mdi:package-variant" size="18" />
            Instalar template
          </NuxtLink>
        </header>

        <section class="grid gap-4 md:grid-cols-4">
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Pipeline ativo</p>
            <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ totalFormatted }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Funis configurados</p>
            <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ funnels.length }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Automações ativas</p>
            <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ activeAutomations }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Tarefas abertas</p>
            <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ tasks.length }}</p>
          </div>
        </section>

        <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Funis da instância</h2>
              <NuxtLink to="/configuracoes/funis" class="text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">Configurar</NuxtLink>
            </div>
            <div class="mt-4 grid gap-3 md:grid-cols-3">
              <div v-for="funnel in funnels" :key="funnel.id" class="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <span class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span class="h-2.5 w-2.5 rounded-full" :class="funnel.colorClass" />
                  {{ funnel.ownerTeam }}
                </span>
                <p class="mt-2 font-bold text-slate-900 dark:text-slate-100">{{ funnel.name }}</p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ funnel.stages.length }} etapas configuradas</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Tarefas inteligentes</h2>
              <NuxtLink to="/configuracoes/automacoes" class="text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">Regras</NuxtLink>
            </div>
            <div class="mt-4 space-y-3">
              <div v-for="task in tasks" :key="task.id" class="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <span class="mt-1 h-2.5 w-2.5 rounded-full" :class="task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-300'" />
                <div class="min-w-0">
                  <p class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ task.title }}</p>
                  <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ task.dealTitle }} · {{ task.ownerName }} · {{ task.dueLabel }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuthMock()
const { totalPipeline } = useKanbanData()
const { funnels, automations, tasks } = useWhitelabelMock()

const activeAutomations = computed(() => automations.value.filter((automation) => automation.active).length)
const totalFormatted = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(totalPipeline.value)
})

if (import.meta.client && !isAuthenticated.value) {
  await navigateTo('/login')
}
</script>
