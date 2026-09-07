<template>
  <main class="relative min-h-screen overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(79,70,229,0.10),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(8,145,178,0.10),transparent_30%)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(8,145,178,0.10),transparent_30%)]" />

    <button
      class="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
      type="button"
      :aria-label="mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'"
      :title="mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'"
      @click="toggleTheme"
    >
      <Icon :name="mode === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="h-4.5 w-4.5" />
    </button>

    <section class="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-12">
      <div class="hidden max-w-xl lg:block">
        <SMovLogo />
        <p class="mt-16 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-400">Relacionamentos em movimento</p>
        <h1 class="mt-5 text-5xl font-semibold leading-[1.12] tracking-tight text-slate-950 dark:text-white xl:text-6xl">
          Organize conversas.<br>
          <span class="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">Movimente negócios.</span>
        </h1>
        <p class="mt-6 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-400">
          Um espaço simples para acompanhar oportunidades, aproximar sua equipe e transformar cada contato em progresso.
        </p>

        <div class="mt-12 flex items-center gap-8 text-sm text-slate-500 dark:text-slate-400">
          <span class="flex items-center gap-2"><Icon name="lucide:layout-dashboard" class="h-4 w-4 text-indigo-500" /> Pipeline visual</span>
          <span class="flex items-center gap-2"><Icon name="lucide:users" class="h-4 w-4 text-cyan-600 dark:text-cyan-400" /> Time conectado</span>
        </div>
      </div>

      <div class="mx-auto w-full max-w-md">
        <div class="mb-10 lg:hidden">
          <SMovLogo />
        </div>

        <div class="rounded-[2rem] border border-white bg-white/90 p-7 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/30 sm:p-10">
          <div class="mb-8">
            <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400">Bem-vindo de volta</p>
            <h2 class="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Acesse sua conta</h2>
            <p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">Entre com seus dados para continuar no SMov.</p>
          </div>

          <LoginForm />
          <p class="mt-5 text-center text-sm text-slate-500">Ainda não tem conta? <NuxtLink to="/cadastro" class="font-semibold text-indigo-600 dark:text-indigo-400">Criar conta</NuxtLink></p>
        </div>

        <p class="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          © {{ new Date().getFullYear() }} SMov · Gestão que acompanha seu ritmo
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'
import SMovLogo from '~/components/auth/SMovLogo.vue'
const { isAuthenticated } = useAuth()
const { mode, toggleTheme } = useTheme()
useHead({ title: 'Entrar · SMov CRM' })
definePageMeta({
  layout: false // Remove o layout default para esta página específica
})
if (import.meta.client && isAuthenticated.value) {
  await navigateTo('/')
}
</script>
