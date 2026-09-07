import type { CRMProduct } from '~/types/crm'
interface ApiProduct {
  id: number, name?: string, title: string, description?: string | null, color: string,
  categories?: Array<{ id: number }>, funnels?: Array<{ id: number }>, fields?: CRMProduct['fields']
}

interface LegacyProductField {
  id: string
  label: string
  type?: CRMProduct['fields'][number]['type']
  tipo?: CRMProduct['fields'][number]['type']
  required?: boolean
  obrigatorio?: boolean
  subFields?: CRMProduct['fields'][number]['subFields']
  subCampos?: Array<{ label: string, type?: 'text' | 'currency' | 'number', tipo?: 'text' | 'currency' | 'number' }>
}

/** Keeps previously stored Portuguese JSON compatible while exposing English models. */
const mapFields = (fields: LegacyProductField[] = []): CRMProduct['fields'] => fields.map(field => ({
  id: field.id,
  label: field.label,
  type: field.type || field.tipo || 'text',
  required: field.required ?? field.obrigatorio ?? false,
  subFields: (field.subFields || field.subCampos || []).map(subField => ({
    label: subField.label,
    type: subField.type || subField.tipo || 'text'
  }))
}))

/** Converts nested API relationships into ID lists that are convenient for the UI. */
const mapProduct = (item: ApiProduct): CRMProduct => ({
  id: item.id, name: item.name || item.title, description: item.description || '', color: item.color,
  categoryIds: (item.categories || []).map(category => category.id),
  funnelIds: (item.funnels || []).map(funnel => String(funnel.id)), fields: mapFields(item.fields as LegacyProductField[])
})

export const useProducts = () => {
  const { request, fetchAll } = useApi()
  const products = useState<CRMProduct[]>('crm-products', () => [])
  const productsLoading = useState('crm-products-loading', () => false)
  const productsError = useState<string | null>('crm-products-error', () => null)
  const loaded = useState('crm-products-loaded', () => false)

  const refreshProducts = async () => {
    productsLoading.value = true
    productsError.value = null
    try {
      products.value = (await fetchAll<ApiProduct>('/products')).map(mapProduct)
      loaded.value = true
    } catch (cause) {
      productsError.value = cause instanceof Error ? cause.message : 'Erro ao carregar produtos.'
    } finally { productsLoading.value = false }
  }

  const productById = (id: number | null | undefined) => products.value.find(product => product.id === id)
  const productsForCategory = (id: number) => products.value.filter(product => product.categoryIds.includes(id))
  const productsForFunnel = (id: string) => products.value.filter(product => product.funnelIds.includes(id))
  /** Builds the technical Laravel prefix from the displayed product name. */
  const addProduct = async (payload: Omit<CRMProduct, 'id'>) => {
    const prefix = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 30)
    await request('/products', { method: 'POST', body: {
      ...payload, title: payload.name, prefix, category_ids: payload.categoryIds, funnel_ids: payload.funnelIds.map(Number)
    } })
    await refreshProducts()
  }
  const removeProduct = async (id: number) => {
    await request(`/products/${id}`, { method: 'DELETE' })
    products.value = products.value.filter(product => product.id !== id)
  }

  // `loaded` prevents cards and pages from requesting the same list concurrently.
  if (import.meta.client && !loaded.value && !productsLoading.value) void refreshProducts()
  return { products, productById, productsForCategory, productsForFunnel, addProduct, removeProduct, refreshProducts, productsLoading, productsError }
}
