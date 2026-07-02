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

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="categoria in categories"
        :key="categoria.id"
        class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-3 bg-indigo-600 rounded-full"></span>
              <h2 class="text-base font-semibold text-gray-900">{{ categoria.name }}</h2>
            </div>
            <p class="mt-1 text-xs font-medium text-gray-500">{{ categoria.segment }}</p>
          </div>
          <button
            @click="removerCategoria(categoria.id)"
            class="text-gray-400 hover:text-red-500 transition text-sm"
            title="Excluir Categoria"
          >
            &times;
          </button>
        </div>

        <p class="text-xs text-gray-400">{{ categoria.description }}</p>

        <div class="bg-gray-50 px-3 py-2 rounded-lg flex items-center justify-between text-xs font-medium text-gray-600">
          <span>Produtos vinculados:</span>
          <span class="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-900 font-bold">
            {{ productsForCategory(categoria.id).length }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Nova Categoria</h3>
          <button @click="fecharModal" class="text-gray-400 hover:text-gray-500 text-lg">&times;</button>
        </div>

        <form @submit.prevent="salvarCategoria" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome *</label>
            <input
              v-model="form.name"
              required
              placeholder="Ex: SIAPE, Governo SP, Varejo, Imobiliário..."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Segmento</label>
            <input
              v-model="form.segment"
              placeholder="Ex: Servidor Federal, Cliente PJ, Ensino Superior..."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Descrição</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Use para orientar a equipe sobre quando selecionar esta categoria."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" @click="fecharModal" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition">
              Salvar Categoria
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { categories, addCategory, removeCategory } = useCategoriesMock()
const { productsForCategory } = useProductsMock()

const isModalOpen = ref(false)

const formLimpo = () => ({
  name: '',
  segment: '',
  description: '',
  active: true
})

const form = ref(formLimpo())

const fecharModal = () => {
  isModalOpen.value = false
  form.value = formLimpo()
}

const salvarCategoria = () => {
  if (!form.value.name.trim()) return

  addCategory({
    name: form.value.name,
    segment: form.value.segment || 'Categoria personalizada',
    description: form.value.description,
    active: form.value.active
  })

  fecharModal()
}

const removerCategoria = (categoryId: number) => {
  if (productsForCategory(categoryId).length > 0) {
    alert('Esta categoria possui produtos vinculados. Remova o vínculo nos produtos antes de excluir.')
    return
  }

  if (confirm('Tem certeza que deseja remover esta categoria?')) {
    removeCategory(categoryId)
  }
}
</script>
