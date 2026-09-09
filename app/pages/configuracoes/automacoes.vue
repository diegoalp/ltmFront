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

    <section class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Icon name="mdi:cog-off-outline" size="32" class="mx-auto text-slate-400" />
      <h2 class="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">Automações indisponíveis</h2>
      <p class="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
        Este módulo está pausado por enquanto e não realiza chamadas para a API.
      </p>
    </section>
  </div>
</template>
