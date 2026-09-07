<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-50 p-5 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <h1 class="text-2xl font-bold">Crie sua conta</h1>
      <p class="mt-2 text-sm text-slate-500">Você poderá criar uma instância e será o administrador dela.</p>
      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <label class="block text-sm font-semibold">Nome<input v-model.trim="form.name" required maxlength="255" autocomplete="name" class="field" /></label>
        <label class="block text-sm font-semibold">E-mail<input v-model.trim="form.email" required type="email" autocomplete="email" class="field" /></label>
        <label class="block text-sm font-semibold">Senha<input v-model="form.password" required type="password" minlength="8" autocomplete="new-password" class="field" /></label>
        <label class="block text-sm font-semibold">Confirmar senha<input v-model="form.password_confirmation" required type="password" minlength="8" autocomplete="new-password" class="field" /></label>
        <p v-if="error || mismatch" role="alert" class="text-sm text-rose-600">{{ mismatch || error }}</p>
        <button :disabled="loading" class="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{{ loading ? 'Criando conta...' : 'Criar conta' }}</button>
      </form>
      <NuxtLink to="/login" class="mt-5 inline-block text-sm font-semibold text-indigo-600 dark:text-indigo-400">Já tenho conta</NuxtLink>
    </section>
  </main>
</template>
<script setup lang="ts">
definePageMeta({ layout: false })
const { register, loading, error } = useAuth()
const form = reactive({ name: '', email: '', password: '', password_confirmation: '' })
const mismatch = ref('')
const submit = async () => {
  mismatch.value = form.password !== form.password_confirmation ? 'As senhas devem ser iguais.' : ''
  if (!mismatch.value && await register(form)) await navigateTo('/instancias')
}
</script>
<style scoped>
.field { @apply mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950; }
</style>
