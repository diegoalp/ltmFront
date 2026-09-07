<template>
  <div class="settings-page space-y-6">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Múltiplos Funis</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Modele fluxos diferentes para conforme a necessidade.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <NuxtLink to="/configuracoes" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Icon name="mdi:arrow-left" size="16" />
          Configurações
        </NuxtLink>
        <button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white" @click="openCreateModal">
          <Icon name="mdi:plus" size="18" />
          Novo funil
        </button>
      </div>
    </div>

    <p v-if="loadError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{{ loadError }}</p>

    <div class="grid gap-5 lg:grid-cols-3">
      <section v-for="funnel in funnels" :key="funnel.id" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-3">
          <div>
            <span class="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] items-center">
              <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: funnel.color || '#F59E0B' }" />
              <h4 class="text-lg font-semibold text-slate-700 dark:text-slate-100">{{ funnel.name }}</h4>
            </span>
            
            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ funnel.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" :disabled="removingId === funnel.id" class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-wait disabled:opacity-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-300" :aria-label="`Remover funil ${funnel.name}`" @click="removeFunnel(funnel)">
              <Icon :name="removingId === funnel.id ? 'mdi:loading' : 'mdi:trash-can-outline'" size="18" :class="{ 'animate-spin': removingId === funnel.id }" />
            </button>
          </div>
        </div>

        <ol class="mt-4 space-y-2">
          <li
            v-for="(stage, index) in funnel.stages"
            :key="stage.id"
            :draggable="reorderingFunnelId !== funnel.id"
            class="flex items-center gap-3 rounded-lg border border-slate-200 border-t-4 bg-transparent px-3 py-2.5 transition dark:border-slate-700"
            :style="{ borderTopColor: stage.color || funnel.color || '#64748B' }"
            :class="[
              draggedStage?.funnelId === funnel.id && draggedStage.index === index ? 'opacity-40' : '',
              dragOverStage?.funnelId === funnel.id && dragOverStage.index === index ? 'border-slate-400 shadow-md dark:border-slate-600' : '',
              reorderingFunnelId === funnel.id ? 'cursor-wait' : 'cursor-grab active:cursor-grabbing'
            ]"
            @dragstart="startStageDrag(funnel.id, index, $event)"
            @dragenter.prevent="dragOverStage = { funnelId: funnel.id, index }"
            @dragover.prevent
            @drop.prevent="dropStage(funnel, index)"
            @dragend="endStageDrag"
          >
            <Icon name="mdi:drag-vertical" size="19" class="shrink-0 text-slate-400" aria-hidden="true" />
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">{{ index + 1 }}</span>
            <div class="min-w-0 flex-1">
              <p class="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: stage.color || funnel.color || '#64748B' }" />
                {{ stage.name }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">SLA: {{ expirationLabel(stage) }}</p>
            </div>
            <Icon v-if="reorderingFunnelId === funnel.id" name="mdi:loading" size="17" class="animate-spin text-slate-400" aria-label="Salvando nova ordem" />
            <div v-else class="flex shrink-0 items-center gap-1">
              <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-teal-600 dark:hover:bg-slate-800" :aria-label="`Editar etapa ${stage.name}`" @mousedown.stop @click="openEditStageModal(funnel, stage)"><Icon name="mdi:pencil-outline" size="17" /></button>
              <button type="button" :disabled="removingStageId === stage.id" class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-100 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-rose-950/50" :aria-label="`Remover etapa ${stage.name}`" @mousedown.stop @click="pendingStageRemoval = { funnel, stage }"><Icon :name="removingStageId === stage.id ? 'mdi:loading' : 'mdi:trash-can-outline'" size="17" :class="{ 'animate-spin': removingStageId === stage.id }" /></button>
            </div>
          </li>
        </ol>
        <p v-if="funnel.stages.length === 0" class="mt-4 rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-sm text-slate-400 dark:border-slate-700">Nenhuma fase cadastrada.</p>
        <button type="button" class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800" @click="openStageModal(funnel)">
          <Icon name="mdi:plus" size="18" />
          Adicionar fase
        </button>
      </section>

    </div>

    <div v-if="selectedFunnel" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-stage-title" @click.self="closeStageModal">
      <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 id="create-stage-title" class="text-lg font-bold text-slate-900 dark:text-slate-100">{{ selectedStage ? 'Editar fase' : 'Adicionar fase' }}</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ selectedStage ? `Edite “${selectedStage.name}”` : 'Nova fase' }} em “{{ selectedFunnel.name }}”.</p>
          </div>
          <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Fechar modal" @click="closeStageModal">
            <Icon name="mdi:close" size="20" />
          </button>
        </div>
        <form class="space-y-4 p-6" @submit.prevent="saveStage">
          <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Nome da fase
            <input v-model="stageForm.name" required autofocus class="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950" placeholder="Ex.: Em análise" />
          </label>
          <label class="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Cor da fase
            <span class="flex items-center gap-3">
              <span class="font-mono text-xs font-normal text-slate-500 dark:text-slate-400">{{ stageForm.color.toUpperCase() }}</span>
              <input v-model="stageForm.color" type="color" class="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950" />
            </span>
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Prazo (opcional)
              <input v-model.number="stageForm.duration" type="number" min="1" class="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-950" placeholder="Sem prazo" />
            </label>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Unidade
              <select v-model="stageForm.durationUnit" :disabled="!stageForm.duration" class="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950">
                <option value="dias">Dias</option>
                <option value="horas">Horas</option>
              </select>
            </label>
          </div>
          <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
            <input v-model="stageForm.isFinal" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
            <span>
              <span class="block text-sm font-semibold text-emerald-900 dark:text-emerald-200">Fase de finalização do negócio</span>
              <span class="mt-1 block text-xs text-emerald-700 dark:text-emerald-300">Marque para definir esta fase como uma fase final do funil.</span>
            </span>
          </label>
          <p v-if="stageError" class="text-sm text-rose-600 dark:text-rose-300">{{ stageError }}</p>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" :disabled="creatingStage" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300" @click="closeStageModal">Cancelar</button>
            <button type="submit" :disabled="creatingStage" class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900">
              <Icon :name="creatingStage ? 'mdi:loading' : selectedStage ? 'mdi:content-save-outline' : 'mdi:plus'" size="18" :class="{ 'animate-spin': creatingStage }" />
              {{ creatingStage ? 'Salvando...' : selectedStage ? 'Salvar alterações' : 'Adicionar fase' }}
            </button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="pendingStageRemoval" class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" @click.self="pendingStageRemoval = null">
      <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50"><Icon name="mdi:trash-can-outline" size="21" /></span>
        <h2 class="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">Remover etapa?</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">“{{ pendingStageRemoval.stage.name }}” será removida permanentemente do funil “{{ pendingStageRemoval.funnel.name }}”.</p>
        <div class="mt-6 flex justify-end gap-2"><button type="button" :disabled="removingStageId !== null" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700" @click="pendingStageRemoval = null">Cancelar</button><button type="button" :disabled="removingStageId !== null" class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60" @click="confirmStageRemoval"><Icon v-if="removingStageId !== null" name="mdi:loading" size="17" class="animate-spin" />{{ removingStageId !== null ? 'Removendo...' : 'Remover etapa' }}</button></div>
      </section>
    </div>

    <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-funnel-title" @click.self="closeCreateModal">
      <section class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 id="create-funnel-title" class="text-lg font-bold text-slate-900 dark:text-slate-100">Criar novo funil</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Defina as informações principais do novo fluxo.</p>
          </div>
          <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Fechar modal" @click="closeCreateModal">
            <Icon name="mdi:close" size="20" />
          </button>
        </div>
        <form class="space-y-4 p-6" @submit.prevent="createFunnel">
          <input v-model="form.name" required class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Nome do funil" />
          <textarea v-model="form.description" rows="3" class="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950" placeholder="Descrição (opcional)" />
          <label class="flex items-center justify-between gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            Cor do funil
            <input v-model="form.color" type="color" class="h-9 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950">
          </label>
          <p v-if="createError" class="text-sm text-rose-600 dark:text-rose-400">{{ createError }}</p>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" :disabled="creating" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" @click="closeCreateModal">Cancelar</button>
            <button type="submit" :disabled="creating" class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900">
              <Icon name="mdi:plus" size="18" />
              {{ creating ? 'Criando...' : 'Criar funil' }}
            </button>
          </div>
        </form>
      </section>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-3 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="translate-y-3 opacity-0"
    >
      <aside v-if="pendingRemoval" class="fixed bottom-5 right-5 z-[60] w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900" role="alert" aria-live="assertive">
        <div class="flex gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
            <Icon name="mdi:trash-can-outline" size="20" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-slate-900 dark:text-slate-100">Remover funil?</p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">“{{ pendingRemoval.name }}” será removido permanentemente.</p>
            <div class="mt-4 flex justify-end gap-2">
              <button type="button" :disabled="removingId !== null" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800" @click="cancelRemoval">Cancelar</button>
              <button type="button" :disabled="removingId !== null" class="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-wait disabled:opacity-60" @click="confirmRemoval">
                <Icon v-if="removingId !== null" name="mdi:loading" size="16" class="animate-spin" />
                {{ removingId !== null ? 'Removendo...' : 'Remover' }}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </Transition>

    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-2 opacity-0" leave-active-class="transition duration-150 ease-in" leave-to-class="translate-y-2 opacity-0">
      <aside v-if="toast" class="fixed bottom-5 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl dark:bg-slate-900" :class="toast.type === 'success' ? 'border-emerald-200 dark:border-emerald-900' : 'border-rose-200 dark:border-rose-900'" role="status" aria-live="polite">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" :class="toast.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300'"><Icon :name="toast.type === 'success' ? 'mdi:check-circle-outline' : 'mdi:alert-circle-outline'" size="20" /></span>
        <div class="min-w-0 flex-1"><p class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ toast.type === 'success' ? 'Sucesso' : 'Não foi possível concluir' }}</p><p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{{ toast.message }}</p></div>
        <button type="button" class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label="Fechar notificação" @click="toast = null"><Icon name="mdi:close" size="18" /></button>
      </aside>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { ApiStage } from '~/types/api'
interface ApiFunnel {
  id: number
  name: string
  description: string | null
  color: string | null
  stages: ApiStage[]
}
interface FunnelsResponse { data: ApiFunnel[] }

const { request } = useApi()
const funnels = ref<ApiFunnel[]>([])
const creating = ref(false)
const removingId = ref<number | null>(null)
const pendingRemoval = ref<ApiFunnel | null>(null)
const isCreateModalOpen = ref(false)
const selectedFunnel = ref<ApiFunnel | null>(null)
const selectedStage = ref<ApiStage | null>(null)
const creatingStage = ref(false)
const removingStageId = ref<number | null>(null)
const pendingStageRemoval = ref<{ funnel: ApiFunnel, stage: ApiStage } | null>(null)
const stageError = ref('')
const reorderingFunnelId = ref<number | null>(null)
const draggedStage = ref<{ funnelId: number, index: number } | null>(null)
const dragOverStage = ref<{ funnelId: number, index: number } | null>(null)
const loadError = ref('')
const createError = ref('')
const toast = ref<{ type: 'success' | 'error', message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined
const sessionStore = useSessionStore()
const { instanceId } = storeToRefs(sessionStore)

const form = reactive({
  name: '',
  description: '',
  ownerTeam: '',
  color: '#F59E0B'
})
const stageForm = reactive<{ name: string, color: string, duration: number | null, durationUnit: 'dias' | 'horas', isFinal: boolean }>({
  name: '', color: '#64748B', duration: null, durationUnit: 'dias', isFinal: false
})

const showToast = (type: 'success' | 'error', message: string) => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { type, message }
  toastTimer = setTimeout(() => { toast.value = null }, 4000)
}

const resetForm = () => Object.assign(form, { name: '', description: '', ownerTeam: '', color: '#F59E0B' })
const openCreateModal = () => {
  createError.value = ''
  isCreateModalOpen.value = true
}
const closeCreateModal = () => {
  if (creating.value) return
  isCreateModalOpen.value = false
  createError.value = ''
  resetForm()
}

const openStageModal = (funnel: ApiFunnel) => {
  selectedFunnel.value = funnel
  selectedStage.value = null
  Object.assign(stageForm, { name: '', color: funnel.color || '#64748B', duration: null, durationUnit: 'dias', isFinal: false })
  stageError.value = ''
}
const openEditStageModal = (funnel: ApiFunnel, stage: ApiStage) => {
  selectedFunnel.value = funnel
  selectedStage.value = stage
  Object.assign(stageForm, {
    name: stage.name,
    color: stage.color || funnel.color || '#64748B',
    duration: stage.duration ?? null,
    isFinal: stage.is_final ?? false,
    durationUnit: stage.durationUnit === 'horas' ? 'horas' : 'dias'
  })
  stageError.value = ''
}
const closeStageModal = () => {
  if (creatingStage.value) return
  selectedFunnel.value = null
  selectedStage.value = null
  stageError.value = ''
  Object.assign(stageForm, { name: '', color: '#64748B', duration: null, durationUnit: 'dias', isFinal: false })
}

const loadFunnels = async () => {
  loadError.value = ''
  if (!instanceId.value) {
    loadError.value = 'Selecione uma instância antes de carregar os funis.'
    return
  }
  try {
    funnels.value = (await request<FunnelsResponse>('/funnels')).data
  } catch (cause) {
    loadError.value = cause instanceof Error ? cause.message : 'Não foi possível carregar os funis.'
  }
}

const expirationLabel = (stage: ApiStage) => stage.duration ? `${stage.duration} ${stage.durationUnit || ''}`.trim() : 'Sem expiração'

const startStageDrag = (funnelId: number, index: number, event: DragEvent) => {
  if (reorderingFunnelId.value !== null) {
    event.preventDefault()
    return
  }
  draggedStage.value = { funnelId, index }
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

const endStageDrag = () => {
  draggedStage.value = null
  dragOverStage.value = null
}

const persistStageOrder = async (funnel: ApiFunnel) => {
  if (!instanceId.value) throw new Error('Selecione uma instância antes de reordenar as fases.')
  const temporaryBase = 1_000_000 + (Date.now() % 1_000_000)

  // Free every final position first because Laravel enforces uniqueness per funnel.
  await Promise.all(funnel.stages.map((stage, index) => request(`/stages/${stage.id}`, {
    method: 'PATCH',
    body: { instance_id: Number(instanceId.value), funnel_id: funnel.id, position: temporaryBase + index }
  })))
  for (const [index, stage] of funnel.stages.entries()) {
    await request(`/stages/${stage.id}`, {
      method: 'PATCH',
      body: { instance_id: Number(instanceId.value), funnel_id: funnel.id, position: index + 1 }
    })
  }
}

const dropStage = async (funnel: ApiFunnel, targetIndex: number) => {
  const source = draggedStage.value
  endStageDrag()
  if (!source || source.funnelId !== funnel.id || source.index === targetIndex || reorderingFunnelId.value !== null) return

  const previousOrder = [...funnel.stages]
  const [movedStage] = funnel.stages.splice(source.index, 1)
  if (!movedStage) return
  funnel.stages.splice(targetIndex, 0, movedStage)
  reorderingFunnelId.value = funnel.id
  loadError.value = ''
  try {
    await persistStageOrder(funnel)
    showToast('success', 'Ordem das etapas atualizada.')
  } catch (cause) {
    funnel.stages = previousOrder
    loadError.value = cause instanceof Error ? cause.message : 'Não foi possível salvar a ordem das fases.'
    showToast('error', loadError.value)
    await loadFunnels()
  } finally {
    reorderingFunnelId.value = null
  }
}

const createFunnel = async () => {
  if (!instanceId.value) {
    createError.value = 'Selecione uma instância antes de criar um funil.'
    return
  }
  creating.value = true
  createError.value = ''
  try {
    await request('/funnels', {
      method: 'POST',
      body: { name: form.name, description: form.description || null, color: form.color, instance_id: Number(instanceId.value) }
    })
    await loadFunnels()
    creating.value = false
    closeCreateModal()
  } catch (cause) {
    createError.value = cause instanceof Error ? cause.message : 'Não foi possível criar o funil.'
  } finally {
    creating.value = false
  }
}

const saveStage = async () => {
  const funnel = selectedFunnel.value
  if (!funnel || !instanceId.value || !stageForm.name.trim()) return
  const isEditing = Boolean(selectedStage.value)
  creatingStage.value = true
  stageError.value = ''
  try {
    const path = selectedStage.value ? `/stages/${selectedStage.value.id}` : '/stages'
    await request(path, { method: selectedStage.value ? 'PATCH' : 'POST', body: {
      instance_id: Number(instanceId.value), funnel_id: funnel.id,
      name: stageForm.name.trim(), color: stageForm.color,
      is_final: stageForm.isFinal,
      ...(!selectedStage.value ? { position: funnel.stages.length + 1 } : {}),
      duration: stageForm.duration || null,
      duration_unit: stageForm.duration ? stageForm.durationUnit : null
    } })
    await loadFunnels()
    showToast('success', isEditing ? 'Etapa atualizada com sucesso.' : 'Etapa adicionada com sucesso.')
    creatingStage.value = false
    closeStageModal()
  } catch (cause) {
    stageError.value = cause instanceof Error ? cause.message : 'Não foi possível salvar a fase.'
    showToast('error', stageError.value)
  } finally {
    creatingStage.value = false
  }
}

const confirmStageRemoval = async () => {
  const target = pendingStageRemoval.value
  if (!target) return
  removingStageId.value = target.stage.id
  loadError.value = ''
  try {
    await request(`/stages/${target.stage.id}`, { method: 'DELETE' })
    target.funnel.stages = target.funnel.stages.filter(stage => stage.id !== target.stage.id)
    pendingStageRemoval.value = null
    showToast('success', 'Etapa removida com sucesso.')
  } catch (cause) {
    loadError.value = cause instanceof Error ? cause.message : 'Não foi possível remover a etapa.'
    showToast('error', loadError.value)
  } finally {
    removingStageId.value = null
  }
}

const removeFunnel = (funnel: ApiFunnel) => {
  pendingRemoval.value = funnel
}

const cancelRemoval = () => {
  if (removingId.value !== null) return
  pendingRemoval.value = null
}

const confirmRemoval = async () => {
  const funnel = pendingRemoval.value
  if (!funnel) return
  removingId.value = funnel.id
  loadError.value = ''
  try {
    await request(`/funnels/${funnel.id}`, { method: 'DELETE' })
    funnels.value = funnels.value.filter(item => item.id !== funnel.id)
    pendingRemoval.value = null
  } catch (cause) {
    loadError.value = cause instanceof Error ? cause.message : 'Não foi possível remover o funil.'
  } finally {
    removingId.value = null
  }
}

onMounted(loadFunnels)
onBeforeUnmount(() => { if (toastTimer) clearTimeout(toastTimer) })
</script>
