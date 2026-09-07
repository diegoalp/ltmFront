<template>
  <div class="settings-page">
    <!-- Page header -->
    <div class="border-b border-gray-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Produtos & Campos Personalizados</h1>
        <p class="mt-2 text-sm text-gray-500">
          Gerencie seus produtos e defina quais campos o vendedor deve preencher ao criar um negócio para cada um deles.
        </p>
      </div>
      <div>
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-sm transition"
        >
          + Novo Produto
        </button>
      </div>
    </div>

    <!-- Registered products -->
    <div class="grid grid-cols-1 gap-4">
      <div v-if="products.length === 0" class="bg-white p-8 text-center text-gray-500 text-sm rounded-xl border border-gray-200 shadow-sm">
        Nenhum produto cadastrado. Clique em "+ Novo Produto" para começar.
      </div>

      <div 
        v-for="product in products"
        :key="product.id"
        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <!-- Product information -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: product.color }"></span>
            <h2 class="text-base font-semibold text-gray-900">{{ product.name }}</h2>
          </div>
          <p class="text-xs text-gray-400 max-w-xl">{{ product.description }}</p>

          <div class="flex flex-wrap gap-1.5 pt-1">
            <span
              v-for="category in getProductCategories(product.categoryIds)"
              :key="category.id"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[11px] font-semibold text-indigo-700"
            >
              {{ category.name }}
            </span>
          </div>

          <div class="flex flex-wrap gap-1.5 pt-1">
            <span
              v-for="funnel in getProductFunnels(product.funnelIds)"
              :key="funnel.id"
              class="inline-flex items-center gap-1.5 rounded-md border border-sky-100 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="funnel.colorClass" />
              {{ funnel.name }}
            </span>
          </div>
          
          <!-- Associated field badges -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            <span 
              v-for="field in product.fields"
              :key="field.id"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-[11px] font-medium text-gray-600"
            >
              {{ field.label }}
              <span class="text-gray-400 text-[10px]">({{ field.type === 'group' ? 'Lista Repetível' : field.type }})</span>
            </span>
          </div>
        </div>

        <!-- Product actions -->
        <div class="flex items-center gap-2 self-end md:self-center">
          <button 
            @click="deleteProduct(product.id)"
            class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-100 transition"
            title="Excluir Produto"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Product creation and configuration modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-2xl w-full my-8 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Modal header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h3 class="text-base font-semibold text-gray-900">Configurar Novo Produto</h3>
            <p class="text-xs text-gray-500 mt-0.5">Defina os dados básicos e onde este produto poderá ser utilizado.</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500 text-xl">&times;</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveProduct" class="p-6 space-y-6">
          
          <!-- Basic data -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome do Produto *</label>
              <input 
                v-model="form.name" 
                type="text" required placeholder="Ex: Compra de Dívida, Margem Livre Novo, Refinanciamento..."
                class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Descrição Breve</label>
              <input 
                v-model="form.description" 
                type="text" placeholder="Instruções curtas para a equipe de vendas sobre esse produto."
                class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Funis atribuídos *</label>
              <p class="mt-1 text-xs text-gray-400">Selecione um ou mais funis nos quais este produto poderá ser utilizado.</p>
              <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  v-for="funnel in activeFunnels"
                  :key="funnel.id"
                  class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                >
                  <input
                    v-model="form.funnelIds"
                    type="checkbox"
                    :value="funnel.id"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="h-2 w-2 rounded-full" :class="funnel.colorClass" />
                  <span>{{ funnel.name }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Categorias atendidas *</label>
              <p class="mt-1 text-xs text-gray-400">São exibidas somente as categorias vinculadas aos funis selecionados.</p>
              <div v-if="availableCategories.length" class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  v-for="category in availableCategories"
                  :key="category.id"
                  class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                >
                  <input
                    v-model="form.categoryIds"
                    type="checkbox"
                    :value="category.id"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{{ category.name }}</span>
                </label>
              </div>
              <p v-else class="mt-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-400">
                {{ form.funnelIds.length ? 'Nenhuma categoria vinculada aos funis selecionados.' : 'Selecione ao menos um funil para visualizar as categorias.' }}
              </p>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Cor do Produto</label>
              <div class="mt-1.5 flex items-center gap-3">
                <input
                  v-model="form.color"
                  type="color"
                  aria-label="Selecionar cor do produto"
                  class="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 bg-white p-1 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  v-model="form.color"
                  type="text"
                  required
                  pattern="#[0-9a-fA-F]{6}"
                  maxlength="7"
                  placeholder="#3B82F6"
                  class="block w-32 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm uppercase text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span class="text-xs text-gray-400">Formato hexadecimal</span>
              </div>
            </div>
          </div>

          <!-- Modal actions -->
          <div class="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button" @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              Salvar Produto
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CRMCategory, CRMFunnel, CRMProduct } from '~/types/crm'

const isModalOpen = ref(false)
const { products, addProduct, removeProduct } = useProducts()
const { activeCategories, categoryById } = useCategories()
const { funnels } = useCrmSettings()
const toast = useToast()
const activeFunnels = computed(() => funnels.value.filter((funnel) => funnel.active))
const availableCategories = computed(() => {
  const selectedFunnelIds = new Set(form.value.funnelIds.map(String))
  return activeCategories.value.filter(category =>
    category.funnelIds.some(funnelId => selectedFunnelIds.has(String(funnelId)))
  )
})

const emptyForm = () => ({
  name: '',
  description: '',
  color: '#3B82F6',
  categoryIds: [] as number[],
  funnelIds: [] as string[]
})

const form = ref(emptyForm())

const openCreateModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = emptyForm()
}

watch(availableCategories, categories => {
  const availableIds = new Set(categories.map(category => category.id))
  form.value.categoryIds = form.value.categoryIds.filter(categoryId => availableIds.has(categoryId))
})

// Save the complete product configuration.
const saveProduct = () => {
  if (!form.value.name.trim() || form.value.categoryIds.length === 0 || form.value.funnelIds.length === 0) return

  addProduct({
    name: form.value.name,
    description: form.value.description,
    color: form.value.color,
    categoryIds: [...form.value.categoryIds],
    funnelIds: [...form.value.funnelIds],
    fields: []
  })

  closeModal()
}

const deleteProduct = async (id: number) => {
  if (await toast.confirm('Novos cards não poderão mais utilizar este produto.', { title: 'Remover produto?', confirmLabel: 'Remover' })) {
    try { await removeProduct(id); toast.success('Produto removido com sucesso.') }
    catch (cause) { toast.error(cause instanceof Error ? cause.message : 'Não foi possível remover o produto.') }
  }
}

const getProductCategories = (categoryIds: number[] = []): CRMCategory[] => {
  return categoryIds
    .map((categoryId) => categoryById(categoryId))
    .filter((category): category is CRMCategory => Boolean(category))
}

const getProductFunnels = (funnelIds: string[] = []): CRMFunnel[] => {
  return funnelIds
    .map((funnelId) => funnels.value.find((funnel) => funnel.id === funnelId))
    .filter((funnel): funnel is CRMFunnel => Boolean(funnel))
}
</script>
