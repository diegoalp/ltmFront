import type { DealCard, DealStage, KanbanColumn } from '~/types/crm'

const COLUMNS: KanbanColumn[] = [
  { id: 1, title: 'Lead', limit: 6 },
  { id: 2, title: 'Simulação', limit: 6 },
  { id: 3, title: 'Documentação', limit: 5 },
  { id: 4, title: 'Negociação', limit: 5 },
  { id: 5, title: 'Proposta', limit: 8 },
  { id: 6, title: 'Fechado', limit: 8 }
]

const DEALS: DealCard[] = [
  {
    id: 1,
    title: 'Antonio Francisco da Silva',
    company: 'Aurora Labs',
    ownerId: 2,
    ownerName: 'Diego Sales',
    stage: 1,
    value: 12500,
    priority: 'high',
    dueDate: '2026-06-04'
  },
  {
    id: 2,
    title: 'Workflow automation pilot',
    company: 'Northline Co',
    ownerId: 1,
    ownerName: 'Diego Sales',
    stage: 2,
    value: 8200,
    priority: 'medium',
    dueDate: '2026-06-10'
  },
  {
    id: 3,
    title: 'Post-sales dashboard package',
    company: 'Monarca Group',
    ownerId: 1,
    ownerName: 'Diego Sales',
    stage: 5,
    value: 19700,
    priority: 'high',
    dueDate: '2026-06-07'
  },
  {
    id: 4,
    title: 'Support team seat expansion',
    company: 'Kappa Retail',
    ownerId: 1,
    ownerName: 'Diego Sales',
    stage: 6,
    value: 5400,
    priority: 'low',
    dueDate: '2026-06-02'
  },
  {
    id: 5,
    title: 'Lead qualification workshop',
    company: 'Lime Energy',
    ownerId: 1,
    ownerName: 'Diego Sales',
    stage: 3,
    value: 4600,
    priority: 'medium',
    dueDate: '2026-06-05'
  },
  {
    id: 6,
    title: 'Quarterly operations review',
    company: 'Vertex Media',
    ownerId: 1,
    ownerName: 'Diego Sales',
    stage: 2,
    value: 9100,
    priority: 'high',
    dueDate: '2026-06-12'
  },
  {
    id: 7,
    title: 'Quarterly operations review',
    company: 'Vertex Media',
    ownerId: 1,
    ownerName: 'Diego Sales',
    stage: 4,
    value: 9100,
    priority: 'high',
    dueDate: '2026-06-12'
  }
]

export const useKanbanData = () => {
  const columns = useState<KanbanColumn[]>('kanban-columns', () => COLUMNS)
  const deals = useState<DealCard[]>('kanban-deals', () => DEALS)

  const totalPipeline = computed(() => deals.value.reduce((sum, card) => sum + card.value, 0))

  const cardsByColumn = computed<Record<DealStage, DealCard[]>>(() => {
    return {
      1: deals.value.filter((card) => card.stage === 1),
      2: deals.value.filter((card) => card.stage === 2),
      3: deals.value.filter((card) => card.stage === 3),
      4: deals.value.filter((card) => card.stage === 4),
      5: deals.value.filter((card) => card.stage === 5),
      6: deals.value.filter((card) => card.stage === 6)
    }
  })

  return {
    columns,
    deals,
    totalPipeline,
    cardsByColumn
  }
}
