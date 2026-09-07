import type { ApiFunnel, ApiStage } from '~/types/api'
import type { CRMFunnel } from '~/types/crm'

const expirationLabel = (stage: ApiStage) => stage.duration
  ? `${stage.duration} ${stage.durationUnit || ''}`
  : 'Sem expiração'

const mapFunnel = (item: ApiFunnel): CRMFunnel => ({
  id: String(item.id),
  name: item.name,
  description: item.description || '',
  ownerTeam: item.ownerTeam || '',
  colorClass: item.color ? '' : 'bg-amber-500',
  color: item.color || null,
  active: item.active,
  stages: (item.stages || []).map(stage => ({
    id: stage.id,
    title: stage.name,
    expirationLabel: expirationLabel(stage),
    color: stage.color || item.color || null,
    isFinal: stage.is_final || false
  }))
})

/** Loads only funnels for screens that do not need the complete CRM settings bundle. */
export const useFunnels = () => {
  const { fetchAll } = useApi()
  const funnels = useState<CRMFunnel[]>('crm-funnels', () => [])
  const funnelsLoading = useState('crm-funnels-loading', () => false)
  const funnelsError = useState<string | null>('crm-funnels-error', () => null)
  const loaded = useState('crm-funnels-loaded', () => false)

  const refreshFunnels = async () => {
    if (funnelsLoading.value) return
    funnelsLoading.value = true
    funnelsError.value = null
    try {
      funnels.value = (await fetchAll<ApiFunnel>('/funnels')).map(mapFunnel)
    } catch (cause) {
      funnelsError.value = cause instanceof Error ? cause.message : 'Erro ao carregar funis.'
    } finally {
      loaded.value = true
      funnelsLoading.value = false
    }
  }

  if (import.meta.client && !loaded.value && !funnelsLoading.value) void refreshFunnels()
  return { funnels, refreshFunnels, funnelsLoading, funnelsError }
}
