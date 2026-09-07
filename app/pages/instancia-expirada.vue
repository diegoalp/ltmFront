<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-50 p-5 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <section class="w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-7 dark:border-amber-900 dark:bg-slate-900">
      <h1 class="text-2xl font-bold">Instância expirada</h1>
      <p class="mt-3 text-sm text-slate-500">O acesso está bloqueado. O usuário master precisa informar uma nova data de expiração para reativar a instância.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink v-if="user?.role === 'master'" to="/instancias" class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Gerenciar instâncias</NuxtLink>
        <NuxtLink to="/" class="rounded-xl border px-4 py-2 text-sm font-semibold">Verificar reativação</NuxtLink>
        <button class="rounded-xl border px-4 py-2 text-sm" @click="logout">Sair</button>
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
definePageMeta({ layout: false })
const { user, logout } = useAuth()
</script>
