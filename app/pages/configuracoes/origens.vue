<template>
  <div class="settings-page">
    <!-- Cabeçalho da Página com Botão de Ação -->
    <div class="border-b border-gray-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Origens de Leads</h1>
        <p class="mt-2 text-sm text-gray-500">
          Identifique e gerencie de onde vêm os seus potenciais clientes para mensurar o retorno de cada canal.
        </p>
      </div>
      <div>
        <button 
          @click="isModalOpen = true"
          class="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-sm transition"
        >
          + Nova Origem
        </button>
      </div>
    </div>

    <!-- Listagem de Origens -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="origens.length === 0" class="p-8 text-center text-gray-500 text-sm">
        Nenhuma origem cadastrada. Clique em "+ Nova Origem" para começar.
      </div>
      
      <ul v-else class="divide-y divide-gray-100">
        <li 
          v-for="origem in origens" 
          :key="origem.id" 
          class="p-4 hover:bg-gray-50 flex items-center justify-between gap-4 transition"
        >
          <!-- Informações da Origem -->
          <div class="flex items-center gap-3">
            <span 
              class="w-2 h-2 rounded-full"
              :class="origem.tipo === 'automatica' ? 'bg-emerald-500' : 'bg-amber-500'"
              :title="origem.tipo === 'automatica' ? 'Entrada Automática/API' : 'Entrada Manual'"
            ></span>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold text-gray-900">{{ origem.nome }}</h3>
                <span 
                  class="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  :class="origem.tipo === 'automatica' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                >
                  {{ origem.tipo === 'automatica' ? 'API / Automática' : 'Manual' }}
                </span>
              </div>
              <p v-if="origem.descricao" class="text-xs text-gray-500 mt-0.5">
                {{ origem.descricao }}
              </p>
            </div>
          </div>

          <!-- Ações -->
          <div class="flex items-center gap-2">
            <button 
              @click="removerOrigem(origem.id)"
              class="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
              title="Excluir"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Modal de Cadastro (Formulário) -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Cabeçalho Modal -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Nova Origem de Leads</h3>
          <button @click="fecharModal" class="text-gray-400 hover:text-gray-500 text-lg">&times;</button>
        </div>

        <!-- Corpo / Formulário -->
        <form @submit.prevent="salvarOrigem" class="p-6 space-y-4">
          <div>
            <label for="nome" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome da Origem *</label>
            <input 
              v-model="form.nome"
              type="text" 
              id="nome" 
              required
              placeholder="Ex: Facebook Ads, Indicação, Google Orgânico..."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label for="tipo" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo de Entrada</label>
            <select 
              v-model="form.tipo"
              id="tipo"
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="manual">Manual (Inserido pelo Vendedor)</option>
              <option value="automatica">Automática (Via Integração de API/Webhook)</option>
            </select>
          </div>

          <div>
            <label for="descricao" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Descrição / Observações</label>
            <textarea 
              v-model="form.descricao"
              id="descricao" 
              rows="3"
              placeholder="Opcional. Ex: Campanha de tráfego iniciada em Jan/2026."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            ></textarea>
          </div>

          <!-- Ações Modal -->
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
              Salvar Origem
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

// Dados simulados iniciais para o CRM
const origens = ref([
  { id: 1, nome: 'Facebook Ads', tipo: 'automatica', descricao: 'Campanhas de tráfego direto para o WhatsApp via API.' },
  { id: 2, nome: 'Indicação de Cliente', tipo: 'manual', descricao: 'Bônus ou indicações boca a boca digitadas pelos consultores.' },
  { id: 3, nome: 'Site Institucional', tipo: 'automatica', descricao: 'Leads vindos do formulário de contato do site.' },
  { id: 4, nome: 'Ativa / Atendimento Frio', tipo: 'manual', descricao: 'Lista de contatos frios comprada ou minerada pela equipe.' }
])

// Limpar formulário de cadastro
const formLimpo = () => ({
  nome: '',
  tipo: 'manual',
  descricao: ''
})

const form = ref(formLimpo())

const fecharModal = () => {
  isModalOpen.value = false
  form.value = formLimpo()
}

// Salvar Nova Origem
const salvarOrigem = () => {
  if (!form.value.nome.trim()) return

  origens.value.push({
    id: Date.now(),
    nome: form.value.nome,
    tipo: form.value.tipo,
    descricao: form.value.descricao || null
  })

  fecharModal()
}

// Excluir Origem
const removerOrigem = (id) => {
  if (confirm('Tem certeza que deseja remover esta origem? Leads já cadastrados com ela manterão o histórico, mas novas escolhas serão bloqueadas.')) {
    origens.value = origens.value.filter(o => o.id !== id)
  }
}
</script>
