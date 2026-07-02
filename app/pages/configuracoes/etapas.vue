<template>
  <div class="settings-page">
    <div class="border-b border-gray-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Etapas do Funil</h1>
        <p class="mt-2 text-sm text-gray-500">
          Gerencie, ordene e configure o tempo de expiração (em dias ou horas) das fases do seu fluxo comercial.
        </p>
      </div>
      <div>
        <button 
          @click="isModalOpen = true"
          class="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-sm transition"
        >
          + Nova Etapa
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="etapas.length === 0" class="p-8 text-center text-gray-500 text-sm">
        Nenhuma etapa cadastrada. Clique em "+ Nova Etapa" para começar.
      </div>
      
      <ul v-else class="divide-y divide-gray-100">
        <li 
          v-for="(etapa, index) in etapas" 
          :key="etapa.id" 
          class="p-4 hover:bg-gray-50 flex items-center justify-between gap-4 transition"
        >
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-xs font-semibold text-gray-600">
              {{ index + 1 }}
            </span>
            <div>
              <h3 class="text-sm font-semibold text-gray-900">{{ etapa.titulo }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">
                <span v-if="etapa.tempoExpiracao">
                  Expira em {{ etapa.tempoExpiracao }} {{ etapa.unidadeExpiracao === 'dias' ? 'dias' : 'horas' }}
                </span>
                <span v-else>
                  Sem tempo de expiração
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button 
              @click="moverEtapa(index, 'subir')" 
              :disabled="index === 0"
              class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
              title="Mover para cima"
            >
              ▲
            </button>
            <button 
              @click="moverEtapa(index, 'descer')" 
              :disabled="index === etapas.length - 1"
              class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
              title="Mover para baixo"
            >
              ▼
            </button>
            <button 
              @click="removerEtapa(etapa.id)"
              class="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition ml-2"
              title="Excluir"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Nova Etapa do Funil</h3>
          <button @click="fecharModal" class="text-gray-400 hover:text-gray-500 text-lg">&times;</button>
        </div>

        <form @submit.prevent="salvarEtapa" class="p-6 space-y-4">
          <div>
            <label for="titulo" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Título da Etapa *</label>
            <input 
              v-model="form.titulo"
              type="text" 
              id="titulo" 
              required
              placeholder="Ex: Prospecção, Negociação..."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Tempo para Expiração</label>
            
            <div class="grid grid-cols-3 gap-2 mt-1.5">
              <input 
                v-model.number="form.tempoExpiracao"
                type="number" 
                id="tempoExpiracao" 
                min="1"
                placeholder="Opcional"
                class="col-span-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <select 
                v-model="form.unidadeExpiracao"
                class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="dias">Dias</option>
                <option value="horas">Horas</option>
              </select>
            </div>
            <p class="mt-1.5 text-xs text-gray-400">Tempo máximo que um card pode ficar parado nesta fase antes de expirar.</p>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button" 
              @click="fecharModal" 
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              Salvar Etapa
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Estado do Modal
const isModalOpen = ref(false)

// Dados simulados (Mock) com suporte a dias e horas
const etapas = ref([
  { id: 1, titulo: 'Contato Inicial', tempoExpiracao: 2, unidadeExpiracao: 'dias' },
  { id: 2, titulo: 'Proposta Enviada', tempoExpiracao: 12, unidadeExpiracao: 'horas' },
  { id: 3, titulo: 'Negociação', tempoExpiracao: null, unidadeExpiracao: 'dias' },
])

// Formulário Limpo com valor padrão para a unidade
const formLimpo = () => ({
  titulo: '',
  tempoExpiracao: null,
  unidadeExpiracao: 'dias'
})

const form = ref(formLimpo())

const fecharModal = () => {
  isModalOpen.value = false
  form.value = formLimpo()
}

// Salvar Etapa
const salvarEtapa = () => {
  if (!form.value.titulo.trim()) return

  etapas.value.push({
    id: Date.now(),
    titulo: form.value.titulo,
    tempoExpiracao: form.value.tempoExpiracao || null,
    unidadeExpiracao: form.value.tempoExpiracao ? form.value.unidadeExpiracao : 'dias'
  })

  fecharModal()
}

// Remover Etapa
const removerEtapa = (id) => {
  if (confirm('Tem certeza que deseja remover esta etapa do funil?')) {
    etapas.value = etapas.value.filter(e => e.id !== id)
  }
}

// Reordenação por Index
const moverEtapa = (index, direcao) => {
  const novaPosicao = direcao === 'subir' ? index - 1 : index + 1
  if (novaPosicao < 0 || novaPosicao >= etapas.value.length) return

  const elemento = etapas.value.splice(index, 1)[0]
  etapas.value.splice(novaPosicao, 0, elemento)
}
</script>
