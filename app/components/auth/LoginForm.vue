<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="space-y-2.5">
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-200" for="email">E-mail</label>
      <div class="relative">
        <Icon name="lucide:mail" class="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          class="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
          placeholder="voce@empresa.com"
          required
        >
      </div>
    </div>

    <div class="space-y-2.5">
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-200" for="password">Senha</label>
      <div class="relative">
        <Icon name="lucide:lock-keyhole" class="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          class="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
          placeholder="Sua senha"
          required
        >
        <button class="absolute right-3 top-1/2 flex -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:hover:text-indigo-400" type="button" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'" @click="showPassword = !showPassword">
          <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <p v-if="error" class="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
      {{ error }}
    </p>

    <button
      type="submit"
      class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 hover:shadow-indigo-600/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
      :disabled="loading"
    >
      {{ loading ? 'Entrando...' : 'Entrar' }}
      <Icon v-if="!loading" name="lucide:arrow-right" class="h-4 w-4" />
    </button>
  </form>
</template>

<script setup lang="ts">
const { login, loading, error, user } = useAuth()
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  const ok = await login({ email: form.email, password: form.password })

  if (ok) {
    const destination = user.value?.instanceId == null
      ? '/instancias'
      : '/'
    await navigateTo(destination)
  }
}
</script>
