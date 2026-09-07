import { createSettingsRepository } from '~/repositories/settingsRepository'

export interface DispositionView {
  id: number
  name: string
  type: string
  description: string | null
  active: boolean
}

/** State and actions for the dispositions screen. */
export const useDispositions = () => {
  const repository = createSettingsRepository()
  const dispositions = useState<DispositionView[]>('dispositions', () => [])

  const loadDispositions = async () => {
    const items = await repository.listDispositions()
    dispositions.value = items.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description || null,
      active: item.active
    }))
  }

  const addDisposition = async (data: Omit<DispositionView, 'id' | 'active'>) => {
    await repository.createDisposition(data)
    await loadDispositions()
  }

  const removeDisposition = async (id: number) => {
    await repository.deleteDisposition(id)
    dispositions.value = dispositions.value.filter(item => item.id !== id)
  }

  return { dispositions, loadDispositions, addDisposition, removeDisposition }
}
