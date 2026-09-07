<template>
  <div class="settings-page w-full">
    <!-- Page header -->
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

    <!-- Dispositions table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full">
      <div v-if="dispositions.length === 0" class="p-8 text-center text-gray-500 text-sm">
        Nenhuma tabulação cadastrada. Clique em "+ Nova Tabulação" para começar.
      </div>
      
      <div v-else class="overflow-x-auto w-full">
        <table class="w-full min-w-max text-left text-sm table-auto border-collapse">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 w-5/12">Nome da Tabulação</th>
              <!-- <th class="px-6 py-4 w-4/12">Tipo de Desfecho</th>
              <th class="px-6 py-4 w-2/12">Uso no Painel</th> -->
              <th class="px-6 py-4 w-1/12 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="disposition in dispositions" :key="disposition.id" class="hover:bg-gray-50/70 transition">
              <!-- Name and description -->
              <td class="px-6 py-4">
                <div class="font-semibold text-gray-900 text-sm">{{ disposition.name }}</div>
                <div v-if="disposition.description" class="text-xs text-gray-400 mt-0.5">{{ disposition.description }}</div>
              </td>
              
              <!-- Tipo de Desfecho (Badge colorido) -->
              <!-- <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
                  :class="getTypeBadgeClass(disposition.type)"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getTypeDotClass(disposition.type)"></span>
                  {{ formatType(disposition.type) }}
                </span>
              </td> -->

              <!-- Visibilidade / Status ativo -->
              <!-- <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                  {{ disposition.active ? 'Disponível' : 'Inativo' }}
                </span>
              </td> -->

              <!-- Delete action -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  @click="deleteDisposition(disposition.id)"
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

    <!-- Creation modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Modal header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Nova Tabulação</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500 text-lg">&times;</button>
        </div>

        <!-- Modal body and form -->
        <form @submit.prevent="saveDisposition" class="p-6 space-y-4">
          <div>
            <label for="nome" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome do Status *</label>
            <input 
              v-model="form.name"
              type="text" id="nome" required
              placeholder="Ex: Sem Interesse, Caixa Postal, Lead Ganho..."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <!-- <div>
            <label for="tipo" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Comportamento do Card (Desfecho) *</label>
            <select 
              v-model="form.type"
              id="tipo"
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="produtivo">Produtivo (Lead continua em andamento/ativo)</option>
              <option value="ganha">Venda Concluída / Ganha (Arquiva com sucesso)</option>
              <option value="perdida">Negócio Perdido / Descarte (Arquiva sem sucesso)</option>
            </select>
            <p class="mt-1 text-xs text-gray-400">Determina se o card continuará no funil ou se será arquivado automaticamente.</p>
          </div> -->

          <div>
            <label for="descricao" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Descrição interna (Opcional)</label>
            <textarea 
              v-model="form.description"
              id="descricao" rows="2"
              placeholder="Explicação curta de quando o vendedor deve usar este status..."
              class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            ></textarea>
          </div>

          <!-- Modal actions -->
          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
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
              Salvar Tabulação
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
const {
  dispositions,
  loadDispositions,
  addDisposition,
  removeDisposition
} = useDispositions()
const toast = useToast()

onMounted(loadDispositions)

const isModalOpen = ref(false)

const emptyForm = () => ({
  name: '',
  type: 'produtivo',
  description: ''
})

const form = ref(emptyForm())

const closeModal = () => {
  isModalOpen.value = false
  form.value = emptyForm()
}

const saveDisposition = async () => {
  if (!form.value.name.trim()) return

  await addDisposition({ name: form.value.name, description: form.value.description || null })

  closeModal()
}

const deleteDisposition = async (id) => {
  if (await toast.confirm('Relatórios antigos que utilizam este status manterão o histórico.', { title: 'Remover regra de tabulação?', confirmLabel: 'Remover' })) {
    try { await removeDisposition(id); toast.success('Regra de tabulação removida com sucesso.') }
    catch (cause) { toast.error(cause instanceof Error ? cause.message : 'Não foi possível remover a regra de tabulação.') }
  }
}

const formatType = (type) => {
  const labels = {
    produtivo: 'Produtivo',
    ganha: 'Ganhou (Sucesso)',
    perdida: 'Perdeu (Morte do lead)'
  }
  return labels[type] || type
}

const getTypeBadgeClass = (type) => {
  if (type === 'ganha') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (type === 'perdida') return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-blue-50 text-blue-700 border-blue-200' // produtivo
}

const getTypeDotClass = (type) => {
  if (type === 'ganha') return 'bg-emerald-500'
  if (type === 'perdida') return 'bg-red-500'
  return 'bg-blue-500'
}
</script>
