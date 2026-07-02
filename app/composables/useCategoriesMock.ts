import type { CRMCategory } from '~/types/crm'

const INITIAL_CATEGORIES: CRMCategory[] = [
  {
    id: 1,
    name: 'SIAPE',
    segment: 'Servidor Federal',
    description: 'Servidores civis federais com margem consignavel.',
    active: true
  },
  {
    id: 2,
    name: 'Exercito',
    segment: 'Forcas Armadas',
    description: 'Militares vinculados ao Exercito Brasileiro.',
    active: true
  },
  {
    id: 3,
    name: 'Governo SP',
    segment: 'Servidor Estadual',
    description: 'Servidores do Governo do Estado de Sao Paulo.',
    active: true
  },
  {
    id: 4,
    name: 'Governo de Goias',
    segment: 'Servidor Estadual',
    description: 'Servidores do Governo do Estado de Goias.',
    active: true
  },
  {
    id: 5,
    name: 'INSS',
    segment: 'Beneficiario',
    description: 'Aposentados e pensionistas do INSS.',
    active: true
  }
]

export const useCategoriesMock = () => {
  const categories = useState<CRMCategory[]>('crm-categories', () => INITIAL_CATEGORIES)

  const activeCategories = computed(() => categories.value.filter((category) => category.active))

  const categoryById = (categoryId: number) => {
    return categories.value.find((category) => category.id === categoryId)
  }

  const addCategory = (payload: Omit<CRMCategory, 'id'>) => {
    categories.value.push({
      id: Date.now(),
      ...payload
    })
  }

  const removeCategory = (categoryId: number) => {
    categories.value = categories.value.filter((category) => category.id !== categoryId)
  }

  return {
    categories,
    activeCategories,
    categoryById,
    addCategory,
    removeCategory
  }
}
