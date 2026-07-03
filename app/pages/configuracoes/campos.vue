<template>
  <div class="settings-page space-y-6">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Construtor de Ficha</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Configure campos, seções e regras de visibilidade para adaptar o negócio a qualquer ramo.</p>
      </div>
      <NuxtLink to="/configuracoes" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <Icon name="mdi:arrow-left" size="16" />
        Configurações
      </NuxtLink>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-100 p-5 dark:border-slate-800">
          <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Campos configurados</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[760px] text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th class="px-5 py-3">Campo</th>
                <th class="px-5 py-3">Seção</th>
                <th class="px-5 py-3">Tipo</th>
                <th class="px-5 py-3">Regra de exibição</th>
                <th class="px-5 py-3">Obrigatório</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="field in customFields" :key="field.id">
                <td class="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{{ field.label }}</td>
                <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ field.section }}</td>
                <td class="px-5 py-4"><span class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ field.type }}</span></td>
                <td class="px-5 py-4 text-slate-500 dark:text-slate-400">{{ field.visibleWhen }}</td>
                <td class="px-5 py-4">
                  <Icon :name="field.required ? 'mdi:check-circle' : 'mdi:minus-circle-outline'" :class="field.required ? 'text-emerald-500' : 'text-slate-300'" size="20" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Adicionar campo</h2>
        <form class="mt-4 space-y-3" @submit.prevent="createField">
          <input v-model="form.label" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Nome do campo" />
          <input v-model="form.section" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Seção da ficha" />
          <select v-model="form.type" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950">
            <option value="text">Texto</option>
            <option value="textarea">Texto longo</option>
            <option value="currency">Moeda</option>
            <option value="number">Número</option>
            <option value="date">Data</option>
            <option value="select">Seleção</option>
            <option value="file">Arquivo</option>
            <option value="group">Lista repetível</option>
          </select>
          <input v-model="form.visibleWhen" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Ex: Produto = Seguro" />
          <label class="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-300">
            <input v-model="form.required" type="checkbox" class="rounded border-slate-300" />
            Campo obrigatório
          </label>
          <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
            <Icon name="mdi:form-textbox" size="18" />
            Adicionar à ficha
          </button>
        </form>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CRMCustomFieldType } from '~/types/crm'

const { customFields, addCustomField } = useWhitelabelMock()

const form = reactive({
  label: '',
  section: '',
  type: 'text' as CRMCustomFieldType,
  visibleWhen: 'Todos os produtos',
  required: false
})

const createField = () => {
  addCustomField({ ...form })
  form.label = ''
  form.section = ''
  form.type = 'text'
  form.visibleWhen = 'Todos os produtos'
  form.required = false
}
</script>
