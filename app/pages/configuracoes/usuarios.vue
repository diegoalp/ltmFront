<template>
  <div class="settings-page w-full">
    <!-- Page header -->
    <div class="border-b border-gray-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Controle de Acesso</h1>
        <p class="mt-2 text-sm text-gray-500">
          Gerencie os usuários do sistema, defina permissões e organize sua força de vendas em equipes.
        </p>
      </div>
      <div class="sm:shrink-0">
        <!-- Primary action changes with the active tab. -->
        <button 
          @click="openCreateModal"
          class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-sm transition"
        >
          {{ activeTab === 'users' ? '+ Novo Usuário' : '+ Nova Equipe' }}
        </button>
      </div>
    </div>

    <!-- Tab navigation -->
    <div class="border-b border-gray-200 mb-6 overflow-x-auto">
      <nav class="-mb-px flex flex-wrap sm:flex-nowrap gap-2 sm:gap-6" aria-label="Tabs">
        <button
          @click="activeTab = 'users'"
          :class="[
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-3 px-4 sm:px-1 border-b-2 text-sm transition-all text-center flex-1 sm:flex-none'
          ]"
        >
          Usuários e Permissões ({{ users.length }})
        </button>
        <button
          @click="activeTab = 'teams'"
          :class="[
            activeTab === 'teams'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-3 px-4 sm:px-1 border-b-2 text-sm transition-all text-center flex-1 sm:flex-none'
          ]"
        >
          Equipes de Venda ({{ teams.length }})
        </button>
      </nav>
    </div>

    <!-- CONTEÚDO: ABA USUÁRIOS (Tabela corrigida para 100% de largura) -->
    <div v-if="activeTab === 'users'" class="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="users.length === 0" class="p-8 text-center text-gray-500 text-sm">
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
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50/70 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-semibold text-gray-900 text-sm">{{ user.name }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
                  :class="getRoleBadgeClass(user.role)"
                >
                  {{ formatRole(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                {{ getTeamName(user.teamId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button type="button" class="p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition" title="Editar Usuário" :aria-label="`Editar ${user.name}`" @click="openEditUser(user)"><Icon name="mdi:pencil-outline" size="17" /></button>
                <button 
                  @click="deleteUser(user.id)"
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
    <div v-if="activeTab === 'teams'" class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div v-if="teams.length === 0" class="col-span-2 bg-white p-8 text-center text-gray-500 text-sm rounded-xl border border-gray-200 shadow-sm">
        Nenhuma equipe cadastrada. Organize seus vendedores criando uma equipe.
      </div>
      
      <div 
        v-for="team in teams"
        :key="team.id"
        class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <span class="w-2 h-3 bg-emerald-500 rounded-full"></span>
              {{ team.name }}
            </h3>
            <button 
              @click="deleteTeam(team.id)"
              class="text-gray-400 hover:text-red-500 transition text-sm"
              title="Excluir Equipe"
            >
              &times;
            </button>
          </div>
          <p class="text-xs text-gray-400 mb-4">{{ team.description || 'Sem descrição cadastrada.' }}</p>
        </div>
        
        <div class="bg-gray-50 px-3 py-2 rounded-lg flex items-center justify-between text-xs font-medium text-gray-600">
          <span>Membros integrados:</span>
          <span class="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-900 font-bold">
            {{ countMembers(team.id) }}
          </span>
        </div>
      </div>
    </div>

    <!-- MODAL DE CADASTRO ÚNICO -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Modal header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">
            {{ activeTab === 'users' ? editingUserId ? 'Editar Usuário' : 'Cadastrar Novo Usuário' : 'Criar Nova Equipe' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500 text-lg">&times;</button>
        </div>

        <!-- FORMULÁRIO DE USUÁRIO -->
        <form v-if="activeTab === 'users'" @submit.prevent="saveUser" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome Completo *</label>
            <input v-model="userForm.name" type="text" required placeholder="Ex: João Silva" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">E-mail de Acesso *</label>
            <input v-model="userForm.email" type="email" required placeholder="joao@empresa.com" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ editingUserId ? 'Nova senha (opcional)' : 'Senha temporária *' }}</label>
            <input v-model="userForm.password" type="password" minlength="8" :required="!editingUserId" autocomplete="new-password" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" :placeholder="editingUserId ? 'Deixe em branco para manter a senha atual' : ''" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nível de Acesso *</label>
              <select v-model="userForm.role" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="seller">Vendedor / Operator</option>
                <option value="admin">Administrador Geral</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Vincular à Equipe</label>
              <select v-model="userForm.teamId" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option :value="null">Nenhuma (Sem Equipe)</option>
                <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Vincular ao Funil</label>
            <select v-model="userForm.funnelId" class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option :value="null">Nenhum funil específico</option>
              <option v-for="funnel in funnels" :key="funnel.id" :value="Number(funnel.id)">{{ funnel.name }}</option>
            </select>
          </div>
          
          <label class="block text-xs font-semibold text-gray-700">Supervisor (opcional)
            <select v-model="userForm.supervisorId" class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option :value="null">Sem supervisor</option>
              <option v-for="supervisor in users.filter(item => item.id !== editingUserId)" :key="supervisor.id" :value="supervisor.id">{{ supervisor.name }}</option>
            </select>
          </label>
          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
            <button type="submit" :disabled="savingUser" class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:cursor-wait disabled:opacity-60">{{ savingUser ? 'Salvando...' : editingUserId ? 'Salvar alterações' : 'Salvar Usuário' }}</button>
          </div>
        </form>

        <!-- FORMULÁRIO DE EQUIPE -->
        <form v-else @submit.prevent="saveTeam" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome da Equipe *</label>
            <input v-model="teamForm.name" type="text" required placeholder="Ex: Equipe Sul, Time de Compra de Dívida" class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Breve Descrição / Objetivo</label>
            <textarea v-model="teamForm.description" rows="3" placeholder="Foco ou região de atuação deste time..." class="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition">Criar Equipe</button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ApiError } from '~/composables/useApi'

const { teams, loadTeams, addTeam, removeTeam } = useTeams()
const { users, loadUsers, addUser, updateUser, removeUser } = useUsers()
const { funnels } = useCrmSettings()
const toast = useToast()

onMounted(() => Promise.all([loadTeams(), loadUsers()]))

const activeTab = ref('users')
const isModalOpen = ref(false)
const savingUser = ref(false)
const editingUserId = ref(null)

const emptyUserForm = () => ({ name: '', email: '', password: '', role: 'seller', teamId: null, funnelId: null, supervisorId: null })
const emptyTeamForm = () => ({ name: '', description: '' })

const userForm = ref(emptyUserForm())
const teamForm = ref(emptyTeamForm())

const openCreateModal = () => { isModalOpen.value = true }

const openEditUser = (user) => {
  editingUserId.value = user.id
  userForm.value = { name: user.name, email: user.email, password: '', role: user.role, teamId: user.teamId, funnelId: user.funnelId, supervisorId: user.supervisorId }
  activeTab.value = 'users'
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  userForm.value = emptyUserForm()
  teamForm.value = emptyTeamForm()
  editingUserId.value = null
}

const saveUser = async () => {
  savingUser.value = true
  try {
    if (editingUserId.value) {
      await updateUser(editingUserId.value, userForm.value)
      closeModal()
      toast.success('Usuário atualizado com sucesso.')
      return
    }
    await addUser(userForm.value)
    closeModal()
    toast.success('Usuário cadastrado com sucesso.')
  } catch (cause) {
    const requiresRestoration = cause instanceof ApiError
      && (cause.code === 'USER_RESTORE_REQUIRED' || cause.status === 409)
    if (!requiresRestoration) return

    const confirmed = await toast.confirm(
      'Este e-mail pertence a um usuário removido desta instância. A senha, o tipo, o funil e a equipe serão atualizados com os dados informados.',
      { title: 'Restaurar usuário?', confirmLabel: 'Restaurar', position: 'center' }
    )
    if (!confirmed) return

    try {
      await addUser(userForm.value, true)
      closeModal()
      toast.success('Usuário restaurado e atualizado com sucesso.')
    } catch {
      // Request errors are displayed globally by useApi.
    }
  } finally {
    savingUser.value = false
  }
}

const saveTeam = async () => {
  await addTeam(teamForm.value)
  closeModal()
}

const deleteUser = async (id) => {
  if (await toast.confirm('O usuário perderá o acesso ao CRM.', { title: 'Revogar acesso?', confirmLabel: 'Revogar' })) {
    try { await removeUser(id); toast.success('Acesso revogado com sucesso.') }
    catch (cause) { toast.error(cause instanceof Error ? cause.message : 'Não foi possível revogar o acesso.') }
  }
}

const deleteTeam = async (id) => {
  if (await toast.confirm('Os membros vinculados voltarão a ficar “Sem Equipe”.', { title: 'Excluir equipe?', confirmLabel: 'Excluir' })) {
    try { await removeTeam(id); toast.success('Equipe excluída com sucesso.') }
    catch (cause) { toast.error(cause instanceof Error ? cause.message : 'Não foi possível excluir a equipe.') }
  }
}

const getTeamName = (teamId) => {
  if (!teamId) return 'Sem Equipe'
  const team = teams.value.find(item => item.id === teamId)
  return team ? team.name : 'Sem Equipe'
}

const countMembers = (teamId) => {
  return users.value.filter(user => user.teamId === teamId).length
}

const formatRole = (role) => {
  const labels = { master: 'Master', admin: 'Admin', seller: 'Vendedor' }
  return labels[role] || role
}

const getRoleBadgeClass = (role) => {
  if (role === 'admin') return 'bg-red-50 text-red-700 border-red-200'
  if (role === 'master') return 'bg-indigo-50 text-indigo-700 border-indigo-200'
  return 'bg-gray-50 text-gray-700 border-gray-200'
}
</script>
