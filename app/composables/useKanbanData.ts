import type { DealCard, DealStage, KanbanColumn } from '~/types/crm'

const COLUMNS: KanbanColumn[] = [
  { id: 1, title: 'Lead'},
  { id: 2, title: 'Simulação'},
  { id: 3, title: 'Documentação'},
  { id: 4, title: 'Negociação',},
  { id: 5, title: 'Proposta'},
  { id: 6, title: 'Fechado'}
]

const OPERATIONS = [
  { id: 1, name: 'NOVO', color: 'bg-blue-500' },
  { id: 2, name: 'PORTABILIDADE', color: 'bg-green-500' },
  { id: 3, name: 'REFIN', color: 'bg-yellow-500' },
  { id: 4, name: 'COMPRA DE DÍVIDA', color: 'bg-red-500' }
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
    dueDate: '2026-06-04',
    bank: 'Banco do Brasil',
    operation: OPERATIONS[0]
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
    dueDate: '2026-06-10',
    bank: 'Bradesco',
    operation: OPERATIONS[1]
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
    dueDate: '2026-06-07',
    bank: 'Itaú',
    operation: OPERATIONS[2]
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
    dueDate: '2026-06-02',
    bank: 'Santander',
    operation: OPERATIONS[3]
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
    dueDate: '2026-06-05',
    bank: 'Caixa Econômica',
    operation: OPERATIONS[3]
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
    dueDate: '2026-06-12',
    bank: 'Itaú',
    operation: OPERATIONS[2]
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
    dueDate: '2026-06-12',
    bank: 'Itaú',
    operation: OPERATIONS[2]
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

  const moveDeal = (dealId: number, stage: DealStage) => {
    const deal = deals.value.find((item) => item.id === dealId)

    if (!deal || deal.stage === stage) {
      return
    }

    deal.stage = stage
  }

  return {
    columns,
    deals,
    totalPipeline,
    cardsByColumn,
    moveDeal
  }
}
