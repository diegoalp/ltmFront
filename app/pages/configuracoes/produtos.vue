<template>
  <div class="settings-page">
    <!-- Cabeçalho da Página -->
    <div class="border-b border-gray-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Produtos & Campos Personalizados</h1>
        <p class="mt-2 text-sm text-gray-500">
          Gerencie seus produtos e defina quais campos o vendedor deve preencher ao criar um negócio para cada um deles.
        </p>
      </div>
      <div>
        <button 
          @click="abrirModalNova"
          class="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-sm transition"
        >
          + Novo Produto
        </button>
      </div>
    </div>

    <!-- Lista de Produtos Cadastrados -->
    <div class="grid grid-cols-1 gap-4">
      <div v-if="produtos.length === 0" class="bg-white p-8 text-center text-gray-500 text-sm rounded-xl border border-gray-200 shadow-sm">
        Nenhum produto cadastrado. Clique em "+ Novo Produto" para começar.
      </div>

      <div 
        v-for="produto in produtos" 
        :key="produto.id" 
        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <!-- Info Produto -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-indigo-600 rounded-full"></span>
            <h2 class="text-base font-semibold text-gray-900">{{ produto.name }}</h2>
          </div>
          <p class="text-xs text-gray-400 max-w-xl">{{ produto.description }}</p>

          <div class="flex flex-wrap gap-1.5 pt-1">
            <span
              v-for="categoria in categoriasDoProduto(produto.categoryIds)"
              :key="categoria.id"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[11px] font-semibold text-indigo-700"
            >
              {{ categoria.name }}
            </span>
          </div>
          
          <!-- Badge/Visualização dos Campos Associados -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            <span 
              v-for="campo in produto.fields" 
              :key="campo.id"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-[11px] font-medium text-gray-600"
            >
              {{ campo.label }} 
              <span class="text-gray-400 text-[10px]">({{ campo.tipo === 'group' ? 'Lista Repetível' : campo.tipo }})</span>
            </span>
          </div>
        </div>

        <!-- Ações do Produto -->
        <div class="flex items-center gap-2 self-end md:self-center">
          <button 
            @click="removerProduto(produto.id)"
            class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-100 transition"
            title="Excluir Produto"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Cadastro / Configuração do Produto -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-2xl w-full my-8 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Cabeçalho Modal -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h3 class="text-base font-semibold text-gray-900">Configurar Novo Produto</h3>
            <p class="text-xs text-gray-500 mt-0.5">Defina o nome e os campos de formulário que este produto vai exigir.</p>
          </div>
          <button @click="fecharModal" class="text-gray-400 hover:text-gray-500 text-xl">&times;</button>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="salvarProduto" class="p-6 space-y-6">
          
          <!-- Dados Básicos -->
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
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Categorias atendidas *</label>
              <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  v-for="categoria in activeCategories"
                  :key="categoria.id"
                  class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                >
                  <input
                    v-model="form.categoryIds"
                    type="checkbox"
                    :value="categoria.id"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{{ categoria.name }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Cor do Produto</label>
              <select
                v-model="form.color"
                class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="bg-blue-500 text-white dark:bg-blue-600 dark:text-slate-100">Azul</option>
                <option value="bg-red-500 text-white dark:bg-red-600 dark:text-slate-100">Vermelho</option>
                <option value="bg-yellow-500 text-white dark:bg-yellow-600 dark:text-slate-100">Amarelo</option>
                <option value="bg-green-500 text-white dark:bg-green-600 dark:text-slate-100">Verde</option>
                <option value="bg-violet-500 text-white dark:bg-violet-600 dark:text-slate-100">Violeta</option>
              </select>
            </div>
          </div>

          <!-- Construtor de Campos Dinâmicos -->
          <div class="border-t border-gray-100 pt-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wider">Campos do Formulário do Card</h4>
              <button 
                type="button"
                @click="adicionarCampo"
                class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                + Adicionar Campo
              </button>
            </div>

            <!-- Lista de Campos em Construção -->
            <div class="space-y-3">
              <div v-if="form.fields.length === 0" class="text-center py-6 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400">
                Nenhum campo personalizado adicionado. O card terá apenas informações gerais.
              </div>

              <div 
                v-for="(campo, index) in form.fields" 
                :key="index"
                class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3"
              >
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <!-- Nome/Label do Campo -->
                  <div class="sm:col-span-5">
                    <input 
                      v-model="campo.label" 
                      type="text" required placeholder="Nome do campo (Ex: Banco, Valor da Parcela)"
                      class="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-white text-gray-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  
                  <!-- Tipo do Campo -->
                  <div class="sm:col-span-4">
                    <select 
                      v-model="campo.tipo"
                      class="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-white text-gray-900 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="text">Texto Simples</option>
                      <option value="currency">Valor Monetário (R$)</option>
                      <option value="number">Número Inteiro</option>
                      <option value="group">Lista Repetível (Vários Contratos)</option>
                    </select>
                  </div>

                  <!-- Campo Obrigatório? -->
                  <div class="sm:col-span-2 flex items-center gap-1.5 justify-center">
                    <input :id="'req-'+index" type="checkbox" v-model="campo.obrigatorio" class="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300" />
                    <label :for="'req-'+index" class="text-xs text-gray-600 font-medium cursor-pointer">Obrigatório</label>
                  </div>

                  <!-- Botão Excluir Campo -->
                  <div class="sm:col-span-1 flex justify-end">
                    <button 
                      type="button" 
                      @click="removerCampo(index)"
                      class="text-gray-400 hover:text-red-500 transition text-sm"
                    >
                      &times;
                    </button>
                  </div>
                </div>

                <!-- Se o tipo selecionado for "Lista Repetível" (Ex: Contratos na Compra de Dívida) -->
                <div v-if="campo.tipo === 'group'" class="pl-4 border-l-2 border-indigo-200 mt-2 space-y-2">
                  <p class="text-[11px] font-medium text-indigo-600 mb-1">Sub-campos dessa lista (Ex: Os dados que vão dentro de cada contrato):</p>
                  <div v-for="(sub, subIdx) in campo.subCampos" :key="subIdx" class="flex gap-2 items-center">
                    <input 
                      v-model="sub.label" 
                      type="text" required placeholder="Nome do sub-campo (Ex: Saldo Devedor, Banco)"
                      class="block w-full max-w-xs rounded-lg border border-gray-300 px-2 py-1 text-xs bg-white text-gray-900 focus:border-indigo-500 focus:outline-none"
                    />
                    <select 
                      v-model="sub.tipo"
                      class="block w-32 rounded-lg border border-gray-300 px-2 py-1 text-xs bg-white text-gray-900 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="text">Texto</option>
                      <option value="currency">Valor (R$)</option>
                      <option value="number">Número</option>
                    </select>
                    <button type="button" @click="campo.subCampos.splice(subIdx, 1)" class="text-red-400 text-xs hover:text-red-600">&times;</button>
                  </div>
                  <button 
                    type="button" 
                    @click="campo.subCampos.push({ label: '', tipo: 'text' })"
                    class="text-[11px] font-semibold text-gray-500 hover:text-indigo-600 block"
                  >
                    + Adicionar Sub-campo à lista
                  </button>
                </div>

              </div>
            </div>
          </div>

          <!-- Botões de Ação do Modal -->
          <div class="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button" @click="fecharModal" 
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
import type { CRMCategory, CRMProduct } from '~/types/crm'

const isModalOpen = ref(false)
const { products: produtos, addProduct, removeProduct } = useProductsMock()
const { activeCategories, categoryById } = useCategoriesMock()

const formLimpo = () => ({
  name: '',
  description: '',
  color: 'bg-blue-500 text-white dark:bg-blue-600 dark:text-slate-100',
  categoryIds: [] as number[],
  fields: [] as CRMProduct['fields']
})

const form = ref(formLimpo())

const abrirModalNova = () => {
  isModalOpen.value = true
}

const fecharModal = () => {
  isModalOpen.value = false
  form.value = formLimpo()
}

// Manipulação dos Campos Dinâmicos no Formulário
const adicionarCampo = () => {
  form.value.fields.push({
    id: 'f_' + Date.now() + Math.random().toString(36).substr(2, 4),
    label: '',
    tipo: 'text',
    obrigatorio: false,
    subCampos: [] // Usado apenas se tipo for 'group'
  })
}

const removerCampo = (index: number) => {
  form.value.fields.splice(index, 1)
}

// Salvar Produto Completo
const salvarProduto = () => {
  if (!form.value.name.trim() || form.value.categoryIds.length === 0) return

  addProduct({
    name: form.value.name,
    description: form.value.description,
    color: form.value.color,
    categoryIds: [...form.value.categoryIds],
    fields: JSON.parse(JSON.stringify(form.value.fields))
  })

  fecharModal()
}

const removerProduto = (id: number) => {
  if (confirm('Aviso: Remover este produto impedirá que novos cards o utilizem. Confirmar exclusão?')) {
    removeProduct(id)
  }
}

const categoriasDoProduto = (categoryIds: number[]): CRMCategory[] => {
  return categoryIds
    .map((categoryId) => categoryById(categoryId))
    .filter((category): category is CRMCategory => Boolean(category))
}
</script>
