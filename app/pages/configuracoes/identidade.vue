<template>
  <div class="settings-page space-y-6">
    <div class="flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Identidade Visual</h1>
        <p class="mt-2 text-sm text-gray-500">
          Ajuste a marca do CRM e mantenha os dados prontos para envio posterior à API.
        </p>
      </div>

      <NuxtLink
        to="/configuracoes"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
      >
        <Icon name="mdi:arrow-left" size="16" />
        Configurações
      </NuxtLink>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
      <section class="space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="grid gap-5 md:grid-cols-[160px_minmax(0,1fr)]">
            <div class="flex flex-col items-center gap-3">
              <div class="flex h-32 w-32 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-3">
                <img
                  v-if="draft.logoDataUrl"
                  :src="draft.logoDataUrl"
                  :alt="`${draft.companyName} logo`"
                  class="max-h-full max-w-full object-contain"
                >
                <span
                  v-else
                  class="flex h-20 w-20 items-center justify-center rounded-2xl text-xl font-bold shadow-sm"
                  :style="{ backgroundColor: draft.primaryColor, color: draft.primaryTextColor }"
                >
                  {{ draftInitials }}
                </span>
              </div>

              <label class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
                <Icon name="mdi:upload" size="16" />
                Logo
                <input class="hidden" type="file" accept="image/*" @change="handleLogoChange">
              </label>

              <button
                v-if="draft.logoDataUrl"
                type="button"
                class="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                @click="draft.logoDataUrl = null"
              >
                Remover logo
              </button>
            </div>

            <div class="space-y-5">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700" for="companyName">Nome da marca</label>
                <input
                  id="companyName"
                  v-model="draft.companyName"
                  class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  type="text"
                  maxlength="32"
                >
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <label v-for="field in colorFields" :key="field.key" class="space-y-2">
                  <span class="block text-sm font-semibold text-gray-700">{{ field.label }}</span>
                  <span class="flex overflow-hidden rounded-xl border border-gray-300 bg-white">
                    <input
                      v-model="draft[field.key]"
                      class="h-11 w-14 cursor-pointer border-0 bg-transparent p-1"
                      type="color"
                    >
                    <input
                      v-model="draft[field.key]"
                      class="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm font-mono text-gray-800 outline-none"
                      type="text"
                      maxlength="7"
                    >
                  </span>
                </label>
              </div>

              <p v-if="uploadError" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {{ uploadError }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-base font-semibold text-gray-900">Esquemas de cores</h2>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              v-for="preset in colorPresets"
              :key="preset.name"
              type="button"
              class="rounded-xl border border-gray-200 bg-white p-3 text-left transition hover:border-gray-300 hover:bg-gray-50"
              @click="applyPreset(preset)"
            >
              <span class="text-sm font-semibold text-gray-800">{{ preset.name }}</span>
              <span class="mt-3 flex gap-1.5">
                <span class="h-6 flex-1 rounded-md" :style="{ backgroundColor: preset.primaryColor }" />
                <span class="h-6 flex-1 rounded-md" :style="{ backgroundColor: preset.secondaryColor }" />
                <span class="h-6 flex-1 rounded-md" :style="{ backgroundColor: preset.accentColor }" />
              </span>
            </button>
          </div>
        </div>
      </section>

      <aside class="space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-base font-semibold text-gray-900">Prévia</h2>

          <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
              <div class="flex items-center gap-2">
                <img
                  v-if="draft.logoDataUrl"
                  :src="draft.logoDataUrl"
                  :alt="`${draft.companyName} logo`"
                  class="h-9 w-9 rounded-lg border border-gray-200 bg-white object-contain p-1"
                >
                <span
                  v-else
                  class="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold"
                  :style="{ backgroundColor: draft.primaryColor, color: draft.primaryTextColor }"
                >
                  {{ draftInitials }}
                </span>
                <span class="text-sm font-bold" :style="{ color: draft.primaryColor }">{{ draft.companyName }}</span>
              </div>
              <span class="h-8 rounded-lg px-3 py-1.5 text-xs font-bold" :style="{ backgroundColor: draft.accentColor, color: accentTextColor }">
                Novo lead
              </span>
            </div>

            <div class="grid grid-cols-[56px_minmax(0,1fr)]">
              <div class="space-y-2 border-r border-gray-200 bg-white p-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg" :style="{ backgroundColor: draft.primaryColor, color: draft.primaryTextColor }">
                  <Icon name="mdi:home" size="17" />
                </span>
                <span class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400">
                  <Icon name="mdi:cog" size="17" />
                </span>
              </div>

              <div class="space-y-3 p-4">
                <div class="rounded-lg border border-gray-200 bg-white p-3">
                  <p class="text-xs font-semibold uppercase text-gray-400">Pipeline</p>
                  <p class="mt-1 text-sm font-bold text-gray-900">Oportunidades ativas</p>
                  <div class="mt-3 h-2 rounded-full bg-gray-100">
                    <div class="h-2 w-2/3 rounded-full" :style="{ backgroundColor: draft.secondaryColor }" />
                  </div>
                </div>
                <div class="rounded-lg border border-gray-200 bg-white p-3">
                  <p class="text-sm font-semibold text-gray-900">Maria Oliveira</p>
                  <p class="text-xs text-gray-500">Crédito consignado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-base font-semibold text-gray-900">Persistência local</h2>
            <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">localStorage</span>
          </div>

          <pre class="mt-4 max-h-60 overflow-auto rounded-xl bg-gray-950 p-4 text-xs text-gray-100">{{ formattedPayload }}</pre>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row xl:flex-col">
          <button
            type="button"
            class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition hover:brightness-105"
            :style="{ backgroundColor: draft.primaryColor, color: draft.primaryTextColor }"
            @click="saveBranding"
          >
            <Icon name="mdi:content-save" size="18" />
            Salvar identidade
          </button>

          <button
            type="button"
            class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
            @click="resetDraft"
          >
            <Icon name="mdi:restore" size="18" />
            Restaurar padrão
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CRMBrandingSettings } from '~/types/crm'

type ColorFieldKey = 'primaryColor' | 'secondaryColor' | 'accentColor' | 'primaryTextColor'

const { settings, uploadError, colorPresets, apiPayload, updateBranding, setLogoFromFile, resetBranding } = useBranding()

const draft = reactive<CRMBrandingSettings>({ ...settings.value })

const colorFields: Array<{ key: ColorFieldKey, label: string }> = [
  { key: 'primaryColor', label: 'Cor principal' },
  { key: 'secondaryColor', label: 'Cor secundária' },
  { key: 'accentColor', label: 'Cor de destaque' },
  { key: 'primaryTextColor', label: 'Texto sobre a cor principal' }
]

const draftInitials = computed(() => (draft.companyName || 'CRM').slice(0, 2).toUpperCase())
const accentTextColor = computed(() => draft.accentColor.toLowerCase() === '#facc15' || draft.accentColor.toLowerCase() === '#f59e0b' ? '#111827' : '#ffffff')
const formattedPayload = computed(() => JSON.stringify(apiPayload.value, null, 2))

const syncDraft = () => {
  Object.assign(draft, settings.value)
}

const applyPreset = (preset: typeof colorPresets[number]) => {
  draft.primaryColor = preset.primaryColor
  draft.secondaryColor = preset.secondaryColor
  draft.accentColor = preset.accentColor
  draft.primaryTextColor = preset.primaryTextColor
}

const handleLogoChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  await setLogoFromFile(file)
  draft.logoDataUrl = settings.value.logoDataUrl
  input.value = ''
}

const saveBranding = () => {
  updateBranding({ ...draft })
  syncDraft()
}

const resetDraft = () => {
  resetBranding()
  syncDraft()
}

onMounted(syncDraft)
</script>
