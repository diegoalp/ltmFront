<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-200" for="email">E-mail</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        placeholder="demo@crm.local"
        required
      >
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-200" for="password">Senha</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        autocomplete="current-password"
        class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        placeholder="123456"
        required
      >
    </div>

    <p v-if="error" class="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
      {{ error }}
    </p>

    <button
      type="submit"
      class="w-full rounded-xl bg-teal-600 px-4 py-2.5 font-medium text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-70"
      :disabled="loading"
    >
      {{ loading ? 'Entrando...' : 'Entrar' }}
    </button>
  </form>
</template>

<script setup lang="ts">
const { login, loading, error } = useAuthMock()

const form = reactive({
  email: 'demo@crm.local',
  password: '123456'
})

const handleSubmit = async () => {
  const ok = await login({ email: form.email, password: form.password })

  if (ok) {
    await navigateTo('/')
  }
}
</script>
