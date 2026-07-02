<template>
  <div class="settings-page w-full">
    <!-- Cabeçalho da Página -->
    <div class="border-b border-gray-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Controle de Acesso</h1>
        <p class="mt-2 text-sm text-gray-500">
          Gerencie os usuários do sistema, defina permissões e organize sua força de vendas em equipes.
        </p>
      </div>
      <div class="sm:shrink-0">
        <!-- Botão Dinâmico baseado na Aba Ativa -->
        <button 
          @click="abrirModalCadastro"
          class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-sm transition"
        >
          {{ abaAtiva === 'usuarios' ? '+ Novo Usuário' : '+ Nova Equipe' }}
        </button>
      </div>
    </div>

    <!-- Navegação por Abas (Tabs) Ajustada para não espremer -->
    <div class="border-b border-gray-200 mb-6 overflow-x-auto">
      <nav class="-mb-px flex flex-wrap sm:flex-nowrap gap-2 sm:gap-6" aria-label="Tabs">
        <button
          @click="abaAtiva = 'usuarios'"
          :class="[
            abaAtiva === 'usuarios'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-3 px-4 sm:px-1 border-b-2 text-sm transition-all text-center flex-1 sm:flex-none'
          ]"
        >
          Usuários e Permissões ({{ usuarios.length }})
        </button>
        <button
          @click="abaAtiva = 'equipes'"
          :class="[
            abaAtiva === 'equipes'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-3 px-4 sm:px-1 border-b-2 text-sm transition-all text-center flex-1 sm:flex-none'
          ]"
        >
          Equipes de Venda ({{ equipes.length }})
        </button>
      </nav>
    </div>

    <!-- CONTEÚDO: ABA USUÁRIOS (Tabela corrigida para 100% de largura) -->
    <div v-if="abaAtiva === 'usuarios'" class="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="usuarios.length === 0" class="p-8 text-center text-gray-500 text-sm">
        Nenhum usuário cadastrado.
      </div>
      <div v-else class="overflow-x-auto w-full">
        <table class="w-full min-w-max text-left text-sm table-auto border-collapse">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 w-5/12">Nome / Email</th>
              <th class="px-6 py-4 w-3/12">Nível de Acesso</th>
              <th class="px-6 py-4 w-3/12">Equipe</th>
              <th class="px-6 py-4 w-1/12 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in usuarios" :key="user.id" class="hover:bg-gray-50/70 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-semibold text-gray-900 text-sm">{{ user.nome }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
                  :class="getBadgeNivelClass(user.nivel)"
                >
                  {{ formatNivel(user.nivel) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                {{ getNomeEquipe(user.equipeId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  @click="removerUsuario(user.id)"
                  class="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Excluir Usuário"
                >
                  <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CONTEÚDO: ABA EQUIPES -->
    <div v-if="abaAtiva === 'equipes'" class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div v-if="equipes.length === 0" class="col-span-2 bg-white p-8 text-center text-gray-500 text-sm rounded-xl border border-gray-200 shadow-sm">
        Nenhuma equipe cadastrada. Organize seus vendedores criando uma equipe.
      </div>
      
      <div 
        v-for="equipe in equipes" 
        :key="equipe.id"
        class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <span class="w-2 h-3 bg-emerald-500 rounded-full"></span>
              {{ equipe.nome }}
            </h3>
            <button 
              @click="removerEquipe(equipe.id)"
              class="text-gray-400 hover:text-red-500 transition text-sm"
              title="Excluir Equipe"
            >
              &times;
            </button>
          </div>
          <p class="text-xs text-gray-400 mb-4">{{ equipe.descricao || 'Sem descrição cadastrada.' }}</p>
        </div>
        
        <div class="bg-gray-50 px-3 py-2 rounded-lg flex items-center justify-between text-xs font-medium text-gray-600">
          <span>Membros integrados:</span>
          <span class="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-900 font-bold">
            {{ contarMembros(equipe.id) }}
          </span>
        </div>
      </div>
    </div>

    <!-- MODAL DE CADASTRO ÚNICO -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Cabeçalho Modal -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">
            {{ abaAtiva === 'usuarios' ? 'Cadastrar Novo Usuário' : 'Criar Nova Equipe' }}
          </h3>
          <button @click="fecharModal" class="text-gray-400 hover:text-gray-500 text-lg">&times;</button>
        </div>

        <!-- FORMULÁRIO DE USUÁRIO -->
        <form v-if="abaAtiva === 'usuarios'" @submit.prevent="salvarUsuario" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome Completo *</label>
            <input v-model="formUser.nome" type="text" required placeholder="Ex: João Silva" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">E-mail de Acesso *</label>
            <input v-model="formUser.email" type="email" required placeholder="joao@empresa.com" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nível de Acesso *</label>
              <select v-model="formUser.nivel" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="vendedor">Vendedor / Operator</option>
                <option value="gerente">Gerente de Equipe</option>
                <option value="admin">Administrador Geral</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Vincular à Equipe</label>
              <select v-model="formUser.equipeId" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option :value="null">Nenhuma (Sem Equipe)</option>
                <option v-for="eq in equipes" :key="eq.id" :value="eq.id">{{ eq.nome }}</option>
              </select>
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" @click="fecharModal" class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition">Salvar Usuário</button>
          </div>
        </form>

        <!-- FORMULÁRIO DE EQUIPE -->
        <form v-else @submit.prevent="salvarEquipe" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome da Equipe *</label>
            <input v-model="formEquipe.nome" type="text" required placeholder="Ex: Equipe Sul, Time de Compra de Dívida" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Breve Descrição / Objetivo</label>
            <textarea v-model="formEquipe.descricao" rows="3" placeholder="Foco ou região de atuação deste time..." class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" @click="fecharModal" class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition">Criar Equipe</button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const abaAtiva = ref('usuarios')
const isModalOpen = ref(false)

const equipes = ref([
  { id: 101, nome: 'Call Center - Interno', descricao: 'Equipe focada no atendimento ativo de prospecção fria.' },
  { id: 102, nome: 'Time Digital - Redes Sociais', descricao: 'Vendedores responsáveis por leads captados via Instagram e Facebook.' }
])

const usuarios = ref([
  { id: 1, nome: 'Eduardo Adm CRM', email: 'eduardo@crm.com.br', nivel: 'admin', equipeId: null },
  { id: 2, nome: 'Mariana Souza', email: 'mariana.sales@crm.com', nivel: 'gerente', equipeId: 102 },
  { id: 3, nome: 'Carlos Henrique', email: 'carlos.henrique@crm.com', nivel: 'vendedor', equipeId: 101 },
  { id: 4, nome: 'Aline Oliveira', email: 'aline@crm.com', nivel: 'vendedor', equipeId: 102 }
])

const formUserLimpo = () => ({ nome: '', email: '', nivel: 'vendedor', equipeId: null })
const formEquipeLimpo = () => ({ nome: '', descricao: '' })

const formUser = ref(formUserLimpo())
const formEquipe = ref(formEquipeLimpo())

const abrirModalCadastro = () => { isModalOpen.value = true }

const fecharModal = () => {
  isModalOpen.value = false
  formUser.value = formUserLimpo()
  formEquipe.value = formEquipeLimpo()
}

const salvarUsuario = () => {
  usuarios.value.push({ id: Date.now(), ...formUser.value })
  fecharModal()
}

const salvarEquipe = () => {
  equipes.value.push({ id: Date.now(), ...formEquipe.value })
  fecharModal()
}

const removerUsuario = (id) => {
  if (confirm('Deseja realmente revogar o acesso deste usuário do CRM?')) {
    usuarios.value = usuarios.value.filter(u => u.id !== id)
  }
}

const removerEquipe = (id) => {
  if (confirm('Aviso: Ao excluir a equipe, os membros vinculados voltarão a ficar "Sem Equipe". Confirmar?')) {
    usuarios.value.forEach(u => { if (u.equipeId === id) u.equipeId = null })
    equipes.value = equipes.value.filter(e => e.id !== id)
  }
}

const getNomeEquipe = (equipeId) => {
  if (!equipeId) return 'Sem Equipe'
  const eq = equipes.value.find(e => e.id === equipeId)
  return eq ? eq.nome : 'Sem Equipe'
}

const contarMembros = (equipeId) => {
  return usuarios.value.filter(u => u.equipeId === equipeId).length
}

const formatNivel = (nivel) => {
  const labels = { admin: 'Admin', gerente: 'Gerente', vendedor: 'Vendedor' }
  return labels[nivel] || nivel
}

const getBadgeNivelClass = (nivel) => {
  if (nivel === 'admin') return 'bg-red-50 text-red-700 border-red-200'
  if (nivel === 'gerente') return 'bg-indigo-50 text-indigo-700 border-indigo-200'
  return 'bg-gray-50 text-gray-700 border-gray-200'
}
</script>
