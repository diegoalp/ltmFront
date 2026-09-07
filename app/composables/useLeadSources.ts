import { createSettingsRepository } from '~/repositories/settingsRepository'

export interface LeadSourceView {
  id: number
  name: string
  type: string
  description: string | null
}

/** State and actions for the lead sources screen. Loading is triggered by the page. */
export const useLeadSources = () => {
  const repository = createSettingsRepository()
  const leadSources = useState<LeadSourceView[]>('lead-sources', () => [])

  const loadLeadSources = async () => {
    const items = await repository.listLeadSources()
    leadSources.value = items.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description || null
    }))
  }

  const addLeadSource = async (data: Omit<LeadSourceView, 'id'>) => {
    await repository.createLeadSource(data)
    await loadLeadSources()
  }

  const removeLeadSource = async (id: number) => {
    await repository.deleteLeadSource(id)
    leadSources.value = leadSources.value.filter(item => item.id !== id)
  }

  return { leadSources, loadLeadSources, addLeadSource, removeLeadSource }
}
