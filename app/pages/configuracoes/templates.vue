<template>
  <div class="settings-page space-y-6">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Templates de Operação</h1>
        <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
          Instale modelos prontos por segmento para transformar o CRM em uma operação whitelabel adaptada ao ramo do cliente.
        </p>
      </div>

      <NuxtLink
        to="/configuracoes"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Icon name="mdi:arrow-left" size="16" />
        Configurações
      </NuxtLink>
    </div>

    <section
      v-if="activeTemplate"
      class="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30"
    >
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Template ativo</p>
          <h2 class="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{{ activeTemplate.name }}</h2>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ activeTemplate.description }}</p>
        </div>
        <span class="inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
          Instalado em {{ installedDate }}
        </span>
      </div>
    </section>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(380px,0.7fr)]">
      <section class="grid gap-4 md:grid-cols-2">
        <button
          v-for="template in templates"
          :key="template.id"
          type="button"
          class="group rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900"
          :class="selectedTemplate.id === template.id ? 'border-slate-900 dark:border-slate-100' : 'border-slate-200 dark:border-slate-800'"
          @click="selectTemplate(template.id)"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <span class="h-2.5 w-2.5 rounded-full" :class="template.accentClass" />
                {{ template.segment }}
              </span>
              <h2 class="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{{ template.name }}</h2>
              <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ template.description }}</p>
            </div>

            <Icon
              :name="selectedTemplate.id === template.id ? 'mdi:check-circle' : 'mdi:chevron-right-circle-outline'"
              size="24"
              class="shrink-0 text-slate-300 transition group-hover:text-slate-500 dark:text-slate-700 dark:group-hover:text-slate-400"
            />
          </div>

          <div class="mt-5 grid grid-cols-3 gap-2">
            <span class="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              {{ template.stages.length }} etapas
            </span>
            <span class="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              {{ template.fields.length }} campos
            </span>
            <span class="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              {{ template.automations.length }} regras
            </span>
          </div>
        </button>
      </section>

      <aside class="space-y-4">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Prévia</p>
              <h2 class="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{{ selectedTemplate.name }}</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ selectedTemplate.description }}</p>
            </div>
            <span class="h-10 w-10 rounded-xl" :class="selectedTemplate.accentClass" />
          </div>

          <button
            type="button"
            class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            @click="installTemplate(selectedTemplate.id)"
          >
            <Icon name="mdi:package-variant-closed-check" size="18" />
            Instalar template
          </button>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 class="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Funil sugerido</h3>
          <ol class="mt-4 space-y-3">
            <li v-for="(stage, index) in selectedTemplate.stages" :key="stage.title" class="flex gap-3">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {{ index + 1 }}
              </span>
              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ stage.title }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">SLA: {{ stage.expirationLabel }}</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 class="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Campos do negócio</h3>
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="field in selectedTemplate.fields"
              :key="field.label"
              class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            >
              {{ field.label }}{{ field.required ? ' *' : '' }}
            </span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 class="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Automações iniciais</h3>
          <div class="mt-4 space-y-3">
            <div v-for="automation in selectedTemplate.automations" :key="automation.trigger" class="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400">Quando {{ automation.trigger }}</p>
              <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{{ automation.action }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 class="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Indicadores e produtos</h3>
          <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div>
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400">Dashboards</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span v-for="item in selectedTemplate.dashboards" :key="item" class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ item }}</span>
              </div>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400">Produtos/serviços</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span v-for="item in selectedTemplate.products" :key="item" class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OperationTemplate } from '~/types/crm'
import { formatDate } from '~/utils/formatters'

const { templates, activeTemplate, installedTemplate, installTemplate, templateById } = useOperationTemplates()

const selectedTemplateId = ref(templates.value[0]?.id ?? '')
const selectedTemplate = computed<OperationTemplate>(() => {
  return templateById(selectedTemplateId.value) ?? templates.value[0]
})

const installedDate = computed(() => {
  return installedTemplate.value ? formatDate(installedTemplate.value.installedAt) : ''
})

const selectTemplate = (templateId: string) => {
  selectedTemplateId.value = templateId
}
</script>
