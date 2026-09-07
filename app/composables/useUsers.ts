import { createSettingsRepository } from '~/repositories/settingsRepository'

export interface UserView {
  id: number
  name: string
  email: string
  role: string
  teamId: number | null
  funnelId: number | null
  supervisorId: number | null
}

/** State and actions for administrative users. */
export const useUsers = () => {
  const repository = createSettingsRepository()
  const users = useState<UserView[]>('admin-users', () => [])

  const loadUsers = async () => {
    const items = await repository.listUsers()
    users.value = items.map(item => ({
      id: item.id,
      name: [item.name, item.lastname].filter(Boolean).join(' '),
      email: item.email,
      role: item.type || 'seller',
      teamId: item.team_id || null,
      funnelId: item.funnel_id || null,
      supervisorId: item.supervisor_id || null
    }))
  }

  const addUser = async (data: Omit<UserView, 'id'> & { password: string }, restore = false) => {
    const [name, ...lastNameParts] = data.name.trim().split(/\s+/)
    await repository.createUser({
      name,
      lastname: lastNameParts.join(' ') || null,
      email: data.email,
      type: data.role,
      team_id: data.teamId,
      funnel_id: data.funnelId,
      supervisor_id: data.supervisorId,
      password: data.password,
      password_confirmation: data.password,
      ...(restore ? { restore: true } : {})
    })
    await loadUsers()
  }

  const removeUser = async (id: number) => {
    await repository.deleteUser(id)
    users.value = users.value.filter(item => item.id !== id)
  }

  const updateUser = async (id: number, data: Omit<UserView, 'id'> & { password?: string }) => {
    const [name, ...lastNameParts] = data.name.trim().split(/\s+/)
    await repository.updateUser(id, {
      name,
      lastname: lastNameParts.join(' ') || null,
      email: data.email,
      type: data.role,
      team_id: data.teamId,
      funnel_id: data.funnelId,
      supervisor_id: data.supervisorId,
      ...(data.password ? { password: data.password, password_confirmation: data.password } : {})
    })
    await loadUsers()
  }

  return { users, loadUsers, addUser, updateUser, removeUser }
}
