<template>
  <main class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-teal-50 to-amber-50 px-4 py-10 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div class="absolute -left-16 top-10 h-56 w-56 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-600/20" />
    <div class="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-amber-300/30 blur-3xl dark:bg-amber-500/20" />

    <button
      class="absolute right-4 top-4 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      type="button"
      @click="toggleTheme"
    >
      {{ mode === 'dark' ? 'Claro' : 'Escuro' }}
    </button>

    <section class="relative mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:p-8">
      <p class="text-xs uppercase tracking-[0.3em] text-teal-600 dark:text-teal-300">Welcome back</p>
      <h1 class="mt-2 text-3xl font-semibold">CRM Access</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Sign in with the demo account and explore the kanban workflow prototype.
      </p>

      <div class="mt-6">
        <LoginForm />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'
const { isAuthenticated } = useAuthMock()
const { mode, toggleTheme } = useTheme()

if (import.meta.client && isAuthenticated.value) {
  await navigateTo('/')
}
</script>
