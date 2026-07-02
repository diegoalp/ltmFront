<template>
  <div class="settings-page w-full">
    <!-- Cabeçalho da Página -->
    <div class="border-b border-gray-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Tabulações (Status)</h1>
        <p class="mt-2 text-sm text-gray-500">
          Cadastre os motivos de atendimento e status finais para classificar os desfechos das tentativas de contato ou finalização de cards.
        </p>
      </div>
      <div class="sm:shrink-0">
        <button 
          @click="isModalOpen = true"
          class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-sm transition"
        >
          + Nova Tabulação
        </button>
      </div>
    </div>

    <!-- Tabela de Tabulações (Largura Total Corrigida) -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full">
      <div v-if="tabulacoes.length === 0" class="p-8 text-center text-gray-500 text-sm">
        Nenhuma tabulação cadastrada. Clique em "+ Nova Tabulação" para começar.
      </div>
      
      <div v-else class="overflow-x-auto w-full">
        <table class="w-full min-w-max text-left text-sm table-auto border-collapse">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 w-5/12">Nome da Tabulação</th>
              <th class="px-6 py-4 w-4/12">Tipo de Desfecho</th>
              <th class="px-6 py-4 w-2/12">Uso no Painel</th>
              <th class="px-6 py-4 w-1/12 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="tab in tabulacoes" :key="tab.id" class="hover:bg-gray-50/70 transition">
              <!-- Nome / Descrição -->
              <td class="px-6 py-4">
                <div class="font-semibold text-gray-900 text-sm">{{ tab.nome }}</div>
                <div v-if="tab.descricao" class="text-xs text-gray-400 mt-0.5">{{ tab.descricao }}</div>
              </td>
              
              <!-- Tipo de Desfecho (Badge colorido) -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
                  :class="getBadgeTipoClass(tab.tipo)"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getBolinhaClass(tab.tipo)"></span>
                  {{ formatTipo(tab.tipo) }}
                </span>
              </td>

              <!-- Visibilidade / Status ativo -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                  {{ tab.ativo ? 'Disponível' : 'Inativo' }}
                </span>
              </td>

              <!-- Botão Deletar -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  @click="removerTabulacao(tab.id)"
                  class="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Excluir Tabulação"
                >
                  <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Cadastro (Formulário) -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Cabeçalho Modal -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Nova Tabulação</h3>
          <button @click="fecharModal" class="text-gray-400 hover:text-gray-500 text-lg">&times;</button>
        </div>

        <!-- Corpo / Formulário -->
        <form @submit.prevent="salvarTabulacao" class="p-6 space-y-4">
          <div>
            <label for="nome" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome do Status *</label>
            <input 
              v-model="form.nome"
              type="text" id="nome" required
              placeholder="Ex: Sem Interesse, Caixa Postal, Lead Ganho..."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label for="tipo" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Comportamento do Card (Desfecho) *</label>
            <select 
              v-model="form.tipo"
              id="tipo"
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="produtivo">Produtivo (Lead continua em andamento/ativo)</option>
              <option value="ganha">Venda Concluída / Ganha (Arquiva com sucesso)</option>
              <option value="perdida">Negócio Perdido / Descarte (Arquiva sem sucesso)</option>
            </select>
            <p class="mt-1 text-xs text-gray-400">Determina se o card continuará no funil ou se será arquivado automaticamente.</p>
          </div>

          <div>
            <label for="descricao" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Descrição interna (Opcional)</label>
            <textarea 
              v-model="form.descricao"
              id="descricao" rows="2"
              placeholder="Explicação curta de quando o vendedor deve usar este status..."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            ></textarea>
          </div>

          <!-- Ações Modal -->
          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
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
              Salvar Tabulação
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isModalOpen = ref(false)

// Mock inicial de dados simulados (Status práticos de um CRM de crédito/vendas)
const tabulacoes = ref([
  { id: 1, nome: 'Ocupado / Caixa Postal', tipo: 'produtivo', descricao: 'Tentativa de contato falhou, o lead será retornado mais tarde.', ativo: true },
  { id: 2, nome: 'Alô / Mudo ou Caiu', tipo: 'produtivo', descricao: 'Cliente atendeu mas a ligação caiu ou ficou muda.', ativo: true },
  { id: 3, nome: 'Contrato Assinado (Pago)', tipo: 'ganha', descricao: 'Proposta integrada, averbada e paga na conta do cliente.', ativo: true },
  { id: 4, nome: 'Sem Margem Disponível', tipo: 'perdida', descricao: 'O cliente não possui margem para a operação de Novo.', ativo: true },
  { id: 5, nome: 'Recusou Proposta / Juros Altos', tipo: 'perdida', descricao: 'Cliente achou a taxa abusiva ou desisitiu do negócio.', ativo: true },
])

const formLimpo = () => ({
  nome: '',
  tipo: 'produtivo',
  descricao: ''
})

const form = ref(formLimpo())

const fecharModal = () => {
  isModalOpen.value = false
  form.value = formLimpo()
}

// Salvar
const salvarTabulacao = () => {
  if (!form.value.nome.trim()) return

  tabulacoes.value.push({
    id: Date.now(),
    nome: form.value.nome,
    tipo: form.value.tipo,
    descricao: form.value.descricao || null,
    ativo: true
  })

  fecharModal()
}

// Remover
const removerTabulacao = (id) => {
  if (confirm('Deseja realmente remover esta regra de tabulação? Relatórios antigos que utilizam este status manterão o histórico.')) {
    tabulacoes.value = tabulacoes.value.filter(t => t.id !== id)
  }
}

// Formatadores visuais de Grid/Badges
const formatTipo = (tipo) => {
  const labels = {
    produtivo: 'Produtivo',
    ganha: 'Ganhou (Sucesso)',
    perdida: 'Perdeu (Morte do lead)'
  }
  return labels[tipo] || tipo
}

const getBadgeTipoClass = (tipo) => {
  if (tipo === 'ganha') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (tipo === 'perdida') return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-blue-50 text-blue-700 border-blue-200' // produtivo
}

const getBolinhaClass = (tipo) => {
  if (tipo === 'ganha') return 'bg-emerald-500'
  if (tipo === 'perdida') return 'bg-red-500'
  return 'bg-blue-500'
}
</script>
