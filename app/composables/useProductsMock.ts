import type { CRMProduct } from '~/types/crm'

const INITIAL_PRODUCTS: CRMProduct[] = [
  {
    id: 1,
    name: 'NOVO',
    description: 'Novo contrato utilizando margem disponivel.',
    color: 'bg-blue-500 text-white dark:bg-blue-600 dark:text-slate-100',
    categoryIds: [1, 2],
    fields: [
      { id: 'c2', label: 'Banco Destino', tipo: 'text', obrigatorio: true, subCampos: [] },
      { id: 'c3', label: 'Margem Utilizada', tipo: 'currency', obrigatorio: true, subCampos: [] },
      { id: 'c4', label: 'Prazo (Meses)', tipo: 'number', obrigatorio: true, subCampos: [] },
      { id: 'c5', label: 'Valor Liberado Estimado', tipo: 'currency', obrigatorio: false, subCampos: [] }
    ]
  },
  {
    id: 2,
    name: 'COMPRA DE DIVIDA',
    description: 'Portabilidade ou compra de contratos de outras instituicoes.',
    color: 'bg-red-500 text-white dark:bg-red-600 dark:text-slate-100',
    categoryIds: [1, 3, 4],
    fields: [
      {
        id: 'c1',
        label: 'Lista de Contratos',
        tipo: 'group',
        obrigatorio: true,
        subCampos: [
          { label: 'Banco de Origem', tipo: 'text' },
          { label: 'Valor da Parcela', tipo: 'currency' },
          { label: 'Parcelas Totais', tipo: 'number' },
          { label: 'Parcelas Restantes', tipo: 'number' },
          { label: 'Saldo Devedor Estimado', tipo: 'currency' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'REFIN',
    description: 'Refinanciamento de contrato ativo.',
    color: 'bg-yellow-500 text-white dark:bg-yellow-600 dark:text-slate-100',
    categoryIds: [1, 5],
    fields: [
      { id: 'c6', label: 'Contrato Atual', tipo: 'text', obrigatorio: true, subCampos: [] },
      { id: 'c7', label: 'Saldo Atualizado', tipo: 'currency', obrigatorio: true, subCampos: [] },
      { id: 'c8', label: 'Troco Estimado', tipo: 'currency', obrigatorio: false, subCampos: [] }
    ]
  }
]

export const useProductsMock = () => {
  const products = useState<CRMProduct[]>('crm-products', () => INITIAL_PRODUCTS)

  const productById = (productId: number) => {
    return products.value.find((product) => product.id === productId)
  }

  const productsForCategory = (categoryId: number) => {
    return products.value.filter((product) => product.categoryIds.includes(categoryId))
  }

  const addProduct = (payload: Omit<CRMProduct, 'id'>) => {
    products.value.push({
      id: Date.now(),
      ...payload
    })
  }

  const removeProduct = (productId: number) => {
    products.value = products.value.filter((product) => product.id !== productId)
  }

  return {
    products,
    productById,
    productsForCategory,
    addProduct,
    removeProduct
  }
}
