<template>
  <div class="settings-page">
    <div class="border-b border-gray-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Categorias de Clientes</h1>
        <p class="mt-2 text-sm text-gray-500">
          Cadastre os nichos, convênios ou públicos atendidos pela operação white label.
        </p>
      </div>
      <button
        @click="isModalOpen = true"
        class="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-sm transition"
      >
        + Nova Categoria
      </button>
    </div>

    <p v-if="categoriesError" class="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ categoriesError }}</p>
    <p v-if="categoriesLoading && categories.length === 0" class="mb-4 text-sm text-gray-500">Carregando categorias...</p>

    <div class="mb-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div><p class="text-sm font-semibold text-gray-900">Filtrar por funil</p><p class="mt-0.5 text-xs text-gray-500">{{ filteredCategories.length }} {{ filteredCategories.length === 1 ? 'categoria encontrada' : 'categorias encontradas' }}</p></div>
      <select v-model="selectedFunnelFilter" class="min-w-56 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
        <option value="all">Todos os funis</option>
        <option v-for="funnel in funnels" :key="funnel.id" :value="funnel.id">{{ funnel.name }}</option>
        <option value="unassigned">Sem funil</option>
      </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-3 bg-indigo-600 rounded-full"></span>
              <h2 class="text-base font-semibold text-gray-900">{{ category.name }}</h2>
            </div>
            <p class="mt-1 text-xs font-medium text-gray-500">{{ category.segment }}</p>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600" :aria-label="`Editar ${category.name}`" title="Editar categoria" @click="openEditModal(category)"><Icon name="mdi:pencil-outline" size="18" /></button>
            <button type="button" :disabled="removingId === category.id" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-wait disabled:opacity-50" :aria-label="`Remover ${category.name}`" title="Remover categoria" @click="deleteCategory(category.id)"><Icon :name="removingId === category.id ? 'mdi:loading' : 'mdi:trash-can-outline'" size="18" :class="{ 'animate-spin': removingId === category.id }" /></button>
          </div>
        </div>

        <p class="text-xs text-gray-400">{{ category.description }}</p>

        <div>
          <p class="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Funis vinculados</p>
          <div v-if="getCategoryFunnels(category).length" class="flex flex-wrap gap-1.5">
            <span v-for="funnel in getCategoryFunnels(category)" :key="funnel.id" class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
              <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: funnel.color || '#64748B' }" />{{ funnel.name }}
            </span>
          </div>
          <span v-else class="text-xs text-gray-400">Nenhum funil vinculado</span>
        </div>

        <div class="bg-gray-50 px-3 py-2 rounded-lg flex items-center justify-between text-xs font-medium text-gray-600">
          <span>Produtos vinculados:</span>
          <span class="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-900 font-bold">
            {{ productsForCategory(category.id).length }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="!categoriesLoading && filteredCategories.length === 0" class="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center text-sm text-gray-500">Nenhuma categoria encontrada para este filtro.</div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">{{ editingId ? 'Editar Categoria' : 'Nova Categoria' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500 text-lg">&times;</button>
        </div>

        <form @submit.prevent="saveCategory" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome *</label>
            <input
              v-model="form.name"
              required
              placeholder="Ex: SIAPE, Governo SP, Varejo, Imobiliário..."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <fieldset>
            <legend class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Funis *</legend>
            <p class="mt-1 text-xs text-gray-500">Selecione um ou mais funis para vincular à categoria.</p>
            <div v-if="availableFunnels.length" class="mt-3 max-h-44 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-2">
              <label v-for="funnel in availableFunnels" :key="funnel.id" class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-gray-50">
                <input v-model="form.funnelIds" type="checkbox" :value="funnel.id" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: funnel.color || '#64748B' }" />
                <span class="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">{{ funnel.name }}</span>
              </label>
            </div>
            <p v-else class="mt-3 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3 py-3 text-xs text-amber-700">Cadastre um funil antes de criar a categoria.</p>
            <p v-if="funnelSelectionError" class="mt-2 text-xs font-medium text-rose-600">Selecione ao menos um funil.</p>
          </fieldset>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" :disabled="saving || availableFunnels.length === 0" class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:cursor-wait disabled:opacity-60">
              {{ saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Salvar Categoria' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CRMCategory, CRMFunnel } from '~/types/crm'

const { categories, addCategory, updateCategory, removeCategory, categoriesLoading, categoriesError } = useCategories()
const { productsForCategory } = useProducts()
const { funnels } = useCrmSettings()
const toast = useToast()

const isModalOpen = ref(false)
const saving = ref(false)
const removingId = ref<number | null>(null)
const editingId = ref<number | null>(null)
const selectedFunnelFilter = ref('all')
const funnelSelectionError = ref(false)
const availableFunnels = computed(() => funnels.value.filter(funnel => funnel.active !== false))
const filteredCategories = computed(() => {
  if (selectedFunnelFilter.value === 'all') return categories.value
  if (selectedFunnelFilter.value === 'unassigned') return categories.value.filter(category => category.funnelIds.length === 0)
  return categories.value.filter(category => category.funnelIds.includes(selectedFunnelFilter.value))
})
const getCategoryFunnels = (category: CRMCategory) => category.funnelIds
  .map(id => funnels.value.find(funnel => String(funnel.id) === String(id)))
  .filter((funnel): funnel is CRMFunnel => Boolean(funnel))

const emptyForm = () => ({
  name: '',
  active: true,
  funnelIds: [] as string[]
})

const form = ref(emptyForm())

const closeModal = () => {
  isModalOpen.value = false
  funnelSelectionError.value = false
  form.value = emptyForm()
  editingId.value = null
}

const openEditModal = (category: CRMCategory) => {
  editingId.value = category.id
  form.value = { name: category.name, active: category.active, funnelIds: [...category.funnelIds] }
  funnelSelectionError.value = false
  isModalOpen.value = true
}

const saveCategory = async () => {
  funnelSelectionError.value = form.value.funnelIds.length === 0
  if (!form.value.name.trim() || funnelSelectionError.value) return
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      active: form.value.active,
      funnelIds: form.value.funnelIds
    }
    const isEditing = Boolean(editingId.value)
    if (editingId.value) await updateCategory(editingId.value, payload)
    else await addCategory(payload)
    closeModal()
    toast.success(isEditing ? 'Categoria atualizada com sucesso.' : 'Categoria cadastrada com sucesso.')
  } catch (cause) {
    categoriesError.value = cause instanceof Error ? cause.message : 'Não foi possível cadastrar a categoria.'
    toast.error(categoriesError.value)
  } finally {
    saving.value = false
  }
}

const deleteCategory = async (categoryId: number) => {
  if (productsForCategory(categoryId).length > 0) {
    toast.error('Esta categoria possui produtos vinculados. Remova o vínculo nos produtos antes de excluir.')
    return
  }

  if (await toast.confirm('A categoria será removida permanentemente.', { title: 'Remover categoria?', confirmLabel: 'Remover' })) {
    removingId.value = categoryId
    try {
      await removeCategory(categoryId)
      toast.success('Categoria removida com sucesso.')
    } catch (cause) {
      categoriesError.value = cause instanceof Error ? cause.message : 'Não foi possível remover a categoria.'
      toast.error(categoriesError.value)
    } finally {
      removingId.value = null
    }
  }
}
</script>
