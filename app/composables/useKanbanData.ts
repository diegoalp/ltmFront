import type { DealCard, DealStage, DealTimelineItem, KanbanColumn } from '~/types/crm'

const COLUMNS: KanbanColumn[] = [
  { id: 1, title: 'Lead'},
  { id: 2, title: 'Simulação'},
  { id: 3, title: 'Documentação'},
  { id: 4, title: 'Negociação',},
  { id: 5, title: 'Proposta'},
  { id: 6, title: 'Fechado'}
]

const DEALS: DealCard[] = [
  {
    id: 1,
    title: 'Antonio Francisco da Silva',
    phone: '(11) 99999-9999',
    document: '123.456.789-00',
    birthDate: '1985-06-15',
    categoryId: 3,
    productId: 1,
    ownerId: 2,
    ownerName: 'Diego Sales',
    stage: 1,
    value: 12500,
    priority: 'high',
    dueDate: '2026-06-04',
    createdAt: '2026-05-30T09:15:00',
    bank: 'Banco do Brasil',
    timeline: [
      { id: 1, date: '2026-05-30T09:15:00', title: 'Negócio criado', userName: 'Diego Sales' },
      { id: 2, date: '2026-06-01T14:00:00', title: 'Mudança para Simulação', userName: 'Diego Sales' },
      { id: 3, date: '2026-06-03T11:20:00', title: 'Atualização enviada para o banco', userName: 'Marina Lopes' }
    ]
  },
  {
    id: 2,
    title: 'Maria Amelinda de Souza',
    categoryId: 1,
    productId: 2,
    ownerId: 1,
    ownerName: 'Diego Sales',
    phone: '(11) 99999-9999',
    document: '123.456.789-00',
    birthDate: '1985-06-15',
    stage: 2,
    value: 8200,
    priority: 'medium',
    dueDate: '2026-06-10',
    createdAt: '2026-05-28T13:40:00',
    bank: 'Bradesco',
    timeline: [
      { id: 1, date: '2026-05-28T13:40:00', title: 'Negócio criado', userName: 'Diego Sales' },
      { id: 2, date: '2026-05-29T10:30:00', title: 'Primeira reunião concluída', userName: 'Larissa Melo' },
      { id: 3, date: '2026-06-01T09:00:00', title: 'Movido para Simulação', userName: 'Diego Sales' }
    ]
  },
  {
    id: 3,
    title: 'Jozué Pereira dos Santos',
    categoryId: 2,
    productId: 3,
    ownerId: 1,
    ownerName: 'Diego Sales',
    phone: '(11) 99999-9999',
    document: '123.456.789-00',
    birthDate: '1985-06-15',
    stage: 5,
    value: 19700,
    priority: 'high',
    dueDate: '2026-06-07',
    createdAt: '2026-05-25T15:20:00',
    bank: 'Itaú',
    timeline: [
      { id: 1, date: '2026-05-25T15:20:00', title: 'Negócio criado', userName: 'Diego Sales' },
      { id: 2, date: '2026-05-27T17:45:00', title: 'Responsável alterado', userName: 'Matheus Costa' },
      { id: 3, date: '2026-06-02T08:30:00', title: 'Preparado para proposta', userName: 'Diego Sales' }
    ]
  },
  {
    id: 4,
    title: 'Mariana Oliveira Lima',
    categoryId: 4,
    productId: 2,
    ownerId: 1,
    ownerName: 'Diego Sales',
    phone: '(98) 98567-1234',
    document: '099.223.498-22',
    birthDate: '1985-06-15',
    stage: 6,
    value: 5400,
    priority: 'low',
    dueDate: '2026-06-02',
    createdAt: '2026-05-20T11:05:00',
    bank: 'Santander',
    timeline: [
      { id: 1, date: '2026-05-20T11:05:00', title: 'Negócio criado', userName: 'Diego Sales' },
      { id: 2, date: '2026-05-23T16:10:00', title: 'Documentos assinados', userName: 'Eduardo Reis' },
      { id: 3, date: '2026-05-30T12:45:00', title: 'Fechado com sucesso', userName: 'Diego Sales' }
    ]
  },
  {
    id: 5,
    title: 'Lucas de Oliveira Martins',
    categoryId: 4,
    productId: 2,
    ownerId: 1,
    ownerName: 'Diego Sales',
    phone: '(34) 98900-9999',
    document: '988.003.234-29',
    birthDate: '1985-06-15',
    stage: 3,
    value: 4600,
    priority: 'medium',
    dueDate: '2026-06-05',
    createdAt: '2026-05-31T10:50:00',
    bank: 'Caixa Econômica',
    timeline: [
      { id: 1, date: '2026-05-31T10:50:00', title: 'Negócio criado', userName: 'Diego Sales' },
      { id: 2, date: '2026-06-01T15:00:00', title: 'Documento enviado ao cliente', userName: 'Larissa Melo' },
      { id: 3, date: '2026-06-03T09:30:00', title: 'Movido para Documentação', userName: 'Diego Sales' }
    ]
  },
  {
    id: 6,
    title: 'Fátima Gomes de Souza',
    categoryId: 1,
    productId: 3,
    ownerId: 1,
    ownerName: 'Diego Sales',
    phone: '(11) 99999-9999',
    document: '233.455.789-00',
    birthDate: '1985-06-15',
    stage: 2,
    value: 9100,
    priority: 'high',
    dueDate: '2026-06-12',
    createdAt: '2026-05-29T08:40:00',
    bank: 'Itaú',
    timeline: [
      { id: 1, date: '2026-05-29T08:40:00', title: 'Negócio criado', userName: 'Diego Sales' },
      { id: 2, date: '2026-06-01T11:00:00', title: 'Reunião de alinhamento', userName: 'Marina Lopes' },
      { id: 3, date: '2026-06-04T13:20:00', title: 'Movido para Simulação', userName: 'Diego Sales' }
    ]
  },
  {
    id: 7,
    title: 'Marina Lopes de Almeida',
    categoryId: 5,
    productId: 3,
    ownerId: 1,
    ownerName: 'Diego Sales',
    phone: '(98) 99999-9999',
    document: '123.456.789-00',
    birthDate: '1985-06-15',
    stage: 4,
    value: 9100,
    priority: 'high',
    dueDate: '2026-06-12',
    createdAt: '2026-05-29T08:40:00',
    bank: 'Itaú',
    timeline: [
      { id: 1, date: '2026-05-29T08:40:00', title: 'Negócio criado', userName: 'Diego Sales' },
      { id: 2, date: '2026-06-05T14:25:00', title: 'Proposta negociada', userName: 'Diego Sales' },
      { id: 3, date: '2026-06-06T11:10:00', title: 'Movido para Negociação', userName: 'Diego Sales' }
    ]
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

  const findDealById = (dealId: number) => deals.value.find((item) => item.id === dealId)

  return {
    columns,
    deals,
    totalPipeline,
    cardsByColumn,
    moveDeal,
    findDealById
  }
}
