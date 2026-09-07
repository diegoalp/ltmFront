import type { CRMCategory } from '~/types/crm'
interface ApiCategory { id: number, name: string, segment?: string | null, description?: string | null, active: boolean, funnel_ids?: Array<number | string>, funnels?: Array<{ id: number | string }> }
type CreateCategoryPayload = Pick<CRMCategory, 'name' | 'active'> & { funnelIds: string[] }

/** Isolates conversion between the API contract and the UI model. */
const mapCategory = (item: ApiCategory): CRMCategory => ({
  id: item.id, name: item.name, segment: item.segment || '', description: item.description || '', active: item.active,
  funnelIds: (item.funnels || item.funnel_ids || []).map(funnel => String(typeof funnel === 'object' ? funnel.id : funnel))
})

export const useCategories = () => {
  const { request, fetchAll, instanceId } = useApi()
  const { funnels } = useFunnels()
  const categories = useState<CRMCategory[]>('crm-categories', () => [])
  const categoriesLoading = useState('crm-categories-loading', () => false)
  const categoriesError = useState<string | null>('crm-categories-error', () => null)
  // Because useState is shared, this flag prevents duplicate component requests.
  const loaded = useState('crm-categories-loaded', () => false)

  const refreshCategories = async () => {
    if (categoriesLoading.value) return
    categoriesLoading.value = true
    categoriesError.value = null
    try {
      categories.value = (await fetchAll<ApiCategory>('/categories')).map(mapCategory)
    } catch (cause) {
      categoriesError.value = cause instanceof Error ? cause.message : 'Erro ao carregar categorias.'
    } finally {
      loaded.value = true
      categoriesLoading.value = false
    }
  }

  const activeCategories = computed(() => categories.value.filter(category => category.active))
  const categoryById = (id: number) => categories.value.find(category => category.id === id)
  /** The API requires the user to explicitly choose at least one funnel. */
  const addCategory = async (payload: CreateCategoryPayload) => {
    if (!instanceId.value) throw new Error('Selecione uma instância antes de cadastrar a categoria.')
    const availableIds = new Set(funnels.value.map(funnel => String(funnel.id)))
    const funnelIds = [...new Set(payload.funnelIds)]
      .filter(id => availableIds.has(String(id)))
      .map(Number)
    if (!funnelIds.length) throw new Error('Cadastre ao menos um funil antes da categoria.')
    await request('/categories', { method: 'POST', body: {
      instance_id: Number(instanceId.value),
      name: payload.name.trim(),
      active: payload.active,
      funnel_ids: funnelIds
    } })
    await refreshCategories()
  }
  const removeCategory = async (id: number) => {
    await request(`/categories/${id}`, { method: 'DELETE' })
    categories.value = categories.value.filter(category => category.id !== id)
  }
  const updateCategory = async (id: number, payload: CreateCategoryPayload) => {
    if (!instanceId.value) throw new Error('Selecione uma instância antes de atualizar a categoria.')
    const funnelIds = [...new Set(payload.funnelIds)].map(Number).filter(Number.isFinite)
    if (!funnelIds.length) throw new Error('Selecione ao menos um funil para a categoria.')
    await request(`/categories/${id}`, { method: 'PATCH', body: {
      instance_id: Number(instanceId.value), name: payload.name.trim(), active: payload.active, funnel_ids: funnelIds
    } })
    await refreshCategories()
  }

  // Auto-loading runs only in the browser to avoid duplicate SSR/client requests.
  if (import.meta.client && !loaded.value && !categoriesLoading.value) void refreshCategories()
  return { categories, activeCategories, categoryById, addCategory, updateCategory, removeCategory, refreshCategories, categoriesLoading, categoriesError }
}
