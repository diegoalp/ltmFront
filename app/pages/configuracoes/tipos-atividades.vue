<template>
  <div class="settings-page">
    <div class="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Tipos de atividades</h1>
        <p class="mt-2 text-sm text-gray-500">Defina as atividades que sua equipe pode agendar nos negócios.</p>
      </div><button class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white" @click="open = true">+
        Novo tipo</button>
    </div>
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <p v-if="loading" class="p-8 text-center text-sm text-gray-500">Carregando...</p>
      <p v-else-if="!activityTypes.length" class="p-8 text-center text-sm text-gray-500">Nenhum tipo de atividade
        cadastrado.</p>
      <ul v-else class="divide-y divide-gray-100">
        <li v-for="item in activityTypes" :key="item.id" class="flex items-center justify-between p-4">
          <div class="flex items-center gap-3"><span class="h-3 w-3 rounded-full"
              :style="{ backgroundColor: item.color || '#4f46e5' }" /><span
              class="text-sm font-semibold text-gray-900">{{ item.name }}</span></div><button
            class="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" @click="remove(item.id)">
            <Icon name="lucide:trash-2" />
          </button>
        </li>
      </ul>
    </div>
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <form class="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900"
        @submit.prevent="save">
        <h2 class="text-lg font-semibold">Novo tipo de atividade</h2><label class="block space-y-2"><span
            class="text-xs font-semibold">Nome</span><input v-model.trim="form.name" required maxlength="30"
            class="w-full rounded-lg border px-3 py-2 dark:bg-slate-950" placeholder="Ex.: Ligação" /></label>
        <fieldset :disabled="funnelsLoading" aria-describedby="activity-funnel-help" class="space-y-2">
          <legend class="text-xs font-semibold">Funis (opcional)</legend>
          <div class="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3 dark:border-slate-700">
            <label v-for="funnel in funnels" :key="funnel.id" class="flex cursor-pointer items-center gap-2 text-sm">
              <input v-model="form.funnelIds" type="checkbox" :value="funnel.id"
                class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span>{{ funnel.name }}</span>
            </label>
            <p v-if="!funnels.length && !funnelsLoading" class="text-xs text-slate-500">Nenhum funil disponível.</p>
          </div>
          <p id="activity-funnel-help" class="text-xs text-slate-500 dark:text-slate-400">Não marque nenhum funil para usar este tipo de atividade em todos os funis.</p>
        </fieldset>
        <p v-if="funnelsLoading" class="text-xs text-slate-500">Carregando funis...</p>
        <p v-if="funnelsError" role="alert" class="text-xs text-rose-600">{{ funnelsError }}</p>
        <div class="flex justify-end gap-2"><button type="button" class="rounded-lg border px-4 py-2 text-sm"
            @click="open = false">Cancelar</button><button
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Salvar</button></div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
const toast = useToast(); const { activityTypes, loading, loadActivityTypes, addActivityType, removeActivityType } = useActivityTypes(); const { funnels, funnelsLoading, funnelsError } = useFunnels()
const open = ref(false)
const form = reactive<{ name: string, funnelIds: string[] }>({ name: '', funnelIds: [] })
const save = async () => { await addActivityType(form); Object.assign(form, { name: '', funnelIds: [] }); open.value = false; toast.success('Tipo de atividade criado.') }
const remove = async (id: number) => { if (await toast.confirm('O tipo será excluído.', { title: 'Excluir tipo?', confirmLabel: 'Excluir' })) await removeActivityType(id) }
onMounted(loadActivityTypes)
</script>
