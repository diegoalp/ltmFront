import type {
  ApiAdminUser,
  ApiDisposition,
  ApiLeadSource,
  ApiStage,
  ApiTeam
} from '~/types/api'

/**
 * Transport layer for administrative resources.
 * It contains no Vue state or UI copy; those concerns belong in composables.
 */
export const createSettingsRepository = () => {
  const { request, fetchAll } = useApi()

  return {
    listLeadSources: () => fetchAll<ApiLeadSource>('/lead-sources'),
    createLeadSource: (body: Omit<ApiLeadSource, 'id'>) => request('/lead-sources', { method: 'POST', body }),
    deleteLeadSource: (id: number) => request(`/lead-sources/${id}`, { method: 'DELETE' }),

    listDispositions: () => fetchAll<ApiDisposition>('/dispositions'),
    createDisposition: (body: Omit<ApiDisposition, 'id' | 'active'>) => request('/dispositions', { method: 'POST', body }),
    deleteDisposition: (id: number) => request(`/dispositions/${id}`, { method: 'DELETE' }),

    listStages: () => fetchAll<ApiStage>('/stages'),
    createStage: (body: Record<string, unknown>) => request('/stages', { method: 'POST', body }),
    deleteStage: (id: number) => request(`/stages/${id}`, { method: 'DELETE' }),

    listTeams: () => fetchAll<ApiTeam>('/teams'),
    createTeam: (body: Omit<ApiTeam, 'id'>) => request('/teams', { method: 'POST', body }),
    deleteTeam: (id: number) => request(`/teams/${id}`, { method: 'DELETE' }),

    listUsers: () => fetchAll<ApiAdminUser>('/users'),
    createUser: (body: Record<string, unknown>) => request('/users', { method: 'POST', body }),
    updateUser: (id: number, body: Record<string, unknown>) => request(`/users/${id}`, { method: 'PATCH', body }),
    deleteUser: (id: number) => request(`/users/${id}`, { method: 'DELETE' })
  }
}
