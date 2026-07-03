<template>
  <div class="settings-page space-y-6">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Papéis e Permissões</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Controle o que administradores, gerentes, vendedores e backoffice podem ver ou executar.</p>
      </div>
      <NuxtLink to="/configuracoes" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Icon name="mdi:arrow-left" size="16" />
        Configurações
      </NuxtLink>
    </div>

    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table class="w-full min-w-[900px] text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            <th class="px-5 py-4">Papel</th>
            <th v-for="label in permissionLabels" :key="label" class="px-4 py-4 text-center">{{ label }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="role in roles" :key="role.id">
            <td class="px-5 py-4">
              <p class="font-bold text-slate-900 dark:text-slate-100">{{ role.name }}</p>
              <p class="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">{{ role.description }}</p>
            </td>
            <td v-for="(_, key) in permissionLabels" :key="key" class="px-4 py-4 text-center">
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-xl transition"
                :class="role.permissions[key] ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600'"
                @click="togglePermission(role.id, key)"
              >
                <Icon :name="role.permissions[key] ? 'mdi:check-bold' : 'mdi:close'" size="18" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <section class="grid gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Regra de venda</p>
        <h2 class="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Visibilidade por equipe</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Vendedores podem ficar limitados aos próprios leads enquanto gerentes enxergam o time.</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Regra financeira</p>
        <h2 class="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Valores protegidos</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Editar valores e exportar dados ficam separados de mover cards e atender clientes.</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Governança</p>
        <h2 class="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Configuração restrita</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Apenas administradores alteram templates, automações, identidade e estrutura da instância.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { roles, permissionLabels, togglePermission } = useWhitelabelMock()
</script>
