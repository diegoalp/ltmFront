import { createSettingsRepository } from '~/repositories/settingsRepository'

export interface TeamView {
  id: number
  name: string
  description: string
}

/** State and actions for teams. */
export const useTeams = () => {
  const repository = createSettingsRepository()
  const teams = useState<TeamView[]>('teams', () => [])

  const loadTeams = async () => {
    const items = await repository.listTeams()
    teams.value = items.map(item => ({ id: item.id, name: item.name, description: item.description || '' }))
  }

  const addTeam = async (data: Omit<TeamView, 'id'>) => {
    await repository.createTeam(data)
    await loadTeams()
  }

  const removeTeam = async (id: number) => {
    await repository.deleteTeam(id)
    teams.value = teams.value.filter(item => item.id !== id)
  }

  return { teams, loadTeams, addTeam, removeTeam }
}
