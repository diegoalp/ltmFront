import { createSettingsRepository } from '~/repositories/settingsRepository'

export interface StageView {
  id: number
  title: string
  expirationTime: number | null
  expirationUnit: string
  funnelId: number
  isFinal: boolean
}

/** State and actions for the stages screen. */
export const useStages = () => {
  const repository = createSettingsRepository()
  const { refreshFunnels } = useFunnels()
  const stages = useState<StageView[]>('stages', () => [])

  const loadStages = async () => {
    const items = await repository.listStages()
    stages.value = items.map(item => ({
      id: item.id,
      title: item.name,
      expirationTime: item.duration || null,
      expirationUnit: item.durationUnit || 'dias',
      funnelId: item.funnel_id,
      isFinal: item.is_final || false
    }))
  }

  const addStage = async (data: Omit<StageView, 'id'>) => {
    const position = stages.value.filter(item => item.funnelId === data.funnelId).length + 1
    await repository.createStage({
      funnel_id: data.funnelId,
      name: data.title,
      position,
      duration: data.expirationTime,
      duration_unit: data.expirationUnit,
      is_final: data.isFinal
    })
    await Promise.all([loadStages(), refreshFunnels()])
  }

  const removeStage = async (id: number) => {
    await repository.deleteStage(id)
    stages.value = stages.value.filter(item => item.id !== id)
  }

  return { stages, loadStages, addStage, removeStage }
}
