<template>
  <div v-if="canSelectInstance" class="min-w-44">
    <label for="working-instance" class="sr-only">Instância de trabalho</label>
    <select
      id="working-instance"
      v-model="selectedInstanceId"
      :disabled="loading"
      class="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      :title="error || 'Selecione a instância de trabalho'"
      @change="persistInstance"
    >
      <option value="" disabled>{{ loading ? 'Carregando instâncias...' : 'Selecionar instância' }}</option>
      <option v-for="instance in instances" :key="instance.id" :value="String(instance.id)" :disabled="instance.isExpired">
        {{ instance.name }}{{ instance.isExpired ? ' (expirada)' : '' }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-xs text-rose-600 dark:text-rose-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const { instances, loading, error, canSelectInstance, loadInstances } = useInstanceContext()
const session = useSessionStore()
const selectedInstanceId = ref('')
const instanceCookie = useCookie<string | null>('crm-instance-id', {
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 30
})

const persistInstance = async () => {
  if (!selectedInstanceId.value) return

  instanceCookie.value = selectedInstanceId.value
  session.selectInstance(selectedInstanceId.value)

  await nextTick()
  window.location.reload()
}

onMounted(async () => {
  selectedInstanceId.value = instanceCookie.value || ''
  await loadInstances()
})
</script>
