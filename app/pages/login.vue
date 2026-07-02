<template>
  <main class="relative flex align-items-center min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-teal-50 to-amber-50 px-4 py-10 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div class="absolute -left-16 top-10 h-56 w-56 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-600/20" />
    <div class="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-amber-300/30 blur-3xl dark:bg-amber-500/20" />

    <button
      class="absolute right-4 top-4 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      type="button"
      @click="toggleTheme"
    >
      {{ mode === 'dark' ? 'Claro' : 'Escuro' }}
    </button>

    <section class="relative mx-auto w-full max-w-md flex items-center">
      <div class="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:p-8">
        <div class="mx-auto flex justify-center">
          <img
            v-if="settings.logoDataUrl"
            :src="settings.logoDataUrl"
            :alt="`${settings.companyName} logo`"
            class="h-14 max-w-40 object-contain"
          >
          <span
            v-else
            class="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold shadow-sm"
            :style="{ backgroundColor: settings.primaryColor, color: settings.primaryTextColor }"
          >
            {{ brandInitials }}
          </span>
        </div>
        <h1 class="mt-3 text-center text-3xl font-semibold priority-color">{{ settings.companyName }}</h1>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 text-center">
          Conectando você aos seus clientes. Faça login para acessar seu pipeline e acelerar suas vendas.
        </p>

        <div class="mt-6">
          <LoginForm />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'
const { isAuthenticated } = useAuthMock()
const { mode, toggleTheme } = useTheme()
const { settings } = useBranding()
const brandInitials = computed(() => settings.value.companyName.slice(0, 2).toUpperCase())
definePageMeta({
  layout: false // Remove o layout default para esta página específica
})
if (import.meta.client && isAuthenticated.value) {
  await navigateTo('/')
}
</script>
