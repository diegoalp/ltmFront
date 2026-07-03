import type { DealCard, DealStage, KanbanColumn } from '~/types/crm'

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
    status: 'active',
    lossReason: null,
    conversation: [
      { id: 1, sender: 'agent', text: 'Olá! Estou acompanhando sua solicitação no CRM.', timestamp: '09:15' },
      { id: 2, sender: 'customer', text: 'Perfeito, estou aguardando as instruções.', timestamp: '09:17' },
      { id: 3, sender: 'agent', text: 'Já enviei a simulação para análise. Pode me responder aqui.', timestamp: '09:20' }
    ],
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

const FUNNEL_DEALS: DealCard[] = [
  {
    id: 101,
    title: 'Renata Martins Consultoria',
    phone: '(11) 98888-1111',
    document: '42.998.110/0001-22',
    birthDate: '1990-03-12',
    categoryId: 1,
    bank: 'Itaú',
    productId: 1,
    ownerId: 3,
    ownerName: 'Backoffice',
    stage: 1,
    funnelId: 'backoffice',
    funnelStageId: 'Documentos',
    value: 14800,
    priority: 'high',
    dueDate: '2026-07-05',
    createdAt: '2026-07-01T10:10:00',
    timeline: [
      { id: 1, date: '2026-07-01T10:10:00', title: 'Enviado ao backoffice', userName: 'Diego Sales' }
    ]
  },
  {
    id: 102,
    title: 'Paulo Henrique Almeida',
    phone: '(21) 97777-2222',
    document: '555.412.888-09',
    birthDate: '1978-09-22',
    categoryId: 5,
    bank: 'Caixa Econômica',
    productId: 2,
    ownerId: 3,
    ownerName: 'Backoffice',
    stage: 2,
    funnelId: 'backoffice',
    funnelStageId: 'Análise',
    value: 6900,
    priority: 'medium',
    dueDate: '2026-07-06',
    createdAt: '2026-07-02T08:30:00',
    timeline: [
      { id: 1, date: '2026-07-02T08:30:00', title: 'Documentos recebidos', userName: 'Marina Lopes' }
    ]
  },
  {
    id: 103,
    title: 'Grupo Lima Serviços',
    phone: '(31) 96666-3333',
    document: '31.774.209/0001-80',
    birthDate: '1982-01-18',
    categoryId: 3,
    bank: 'Santander',
    productId: 3,
    ownerId: 4,
    ownerName: 'Operações',
    stage: 3,
    funnelId: 'backoffice',
    funnelStageId: 'Correção',
    value: 12300,
    priority: 'high',
    dueDate: '2026-07-04',
    createdAt: '2026-07-01T16:45:00',
    timeline: [
      { id: 1, date: '2026-07-01T16:45:00', title: 'Pendência documental aberta', userName: 'Backoffice' }
    ]
  },
  {
    id: 201,
    title: 'Mariana Oliveira Lima',
    phone: '(98) 98567-1234',
    document: '099.223.498-22',
    birthDate: '1985-06-15',
    categoryId: 4,
    bank: 'Santander',
    productId: 2,
    ownerId: 5,
    ownerName: 'Sucesso do Cliente',
    stage: 1,
    funnelId: 'pos-venda',
    funnelStageId: 'Boas-vindas',
    value: 5400,
    priority: 'low',
    dueDate: '2026-07-08',
    createdAt: '2026-07-02T11:05:00',
    timeline: [
      { id: 1, date: '2026-07-02T11:05:00', title: 'Cliente recebido no pós-venda', userName: 'Sistema' }
    ]
  },
  {
    id: 202,
    title: 'Cláudia Fernanda Ramos',
    phone: '(51) 95555-4444',
    document: '707.118.312-44',
    birthDate: '1972-04-09',
    categoryId: 1,
    bank: 'Bradesco',
    productId: 1,
    ownerId: 5,
    ownerName: 'Sucesso do Cliente',
    stage: 2,
    funnelId: 'pos-venda',
    funnelStageId: 'Acompanhamento',
    value: 8700,
    priority: 'medium',
    dueDate: '2026-07-12',
    createdAt: '2026-07-01T12:25:00',
    timeline: [
      { id: 1, date: '2026-07-01T12:25:00', title: 'Follow-up de satisfação agendado', userName: 'Sistema' }
    ]
  },
  {
    id: 203,
    title: 'Carlos Eduardo Nunes',
    phone: '(85) 94444-5555',
    document: '881.330.510-91',
    birthDate: '1968-11-30',
    categoryId: 5,
    bank: 'Banco do Brasil',
    productId: 3,
    ownerId: 5,
    ownerName: 'Sucesso do Cliente',
    stage: 3,
    funnelId: 'pos-venda',
    funnelStageId: 'Renovação',
    value: 11200,
    priority: 'high',
    dueDate: '2026-07-15',
    createdAt: '2026-06-28T09:00:00',
    timeline: [
      { id: 1, date: '2026-06-28T09:00:00', title: 'Oportunidade de renovação detectada', userName: 'Sistema' }
    ]
  }
]

const stageTitleById = (stage: DealStage) => {
  return COLUMNS.find((column) => column.id === stage)?.title ?? 'Lead'
}

export const useKanbanData = () => {
  const { funnels } = useWhitelabelMock()
  const columns = useState<KanbanColumn[]>('kanban-columns', () => COLUMNS)
  const deals = useState<DealCard[]>('kanban-deals', () => [
    ...DEALS.map((deal) => ({
      ...deal,
      funnelId: deal.funnelId ?? 'comercial',
      funnelStageId: deal.funnelStageId ?? stageTitleById(deal.stage)
    })),
    ...FUNNEL_DEALS
  ])

  const totalPipeline = computed(() => deals.value.reduce((sum, card) => sum + card.value, 0))

  const cardsByColumn = computed<Record<DealStage, DealCard[]>>(() => {
    return {
      1: deals.value.filter((card) => card.stage === 1 && (card.funnelId ?? 'comercial') === 'comercial'),
      2: deals.value.filter((card) => card.stage === 2 && (card.funnelId ?? 'comercial') === 'comercial'),
      3: deals.value.filter((card) => card.stage === 3 && (card.funnelId ?? 'comercial') === 'comercial'),
      4: deals.value.filter((card) => card.stage === 4 && (card.funnelId ?? 'comercial') === 'comercial'),
      5: deals.value.filter((card) => card.stage === 5 && (card.funnelId ?? 'comercial') === 'comercial'),
      6: deals.value.filter((card) => card.stage === 6 && (card.funnelId ?? 'comercial') === 'comercial')
    }
  })

  const funnelColumns = (funnelId: string): KanbanColumn[] => {
    if (funnelId === 'comercial') {
      return COLUMNS
    }

    const funnel = funnels.value.find((item) => item.id === funnelId)

    return (funnel?.stages ?? []).map((stage) => ({
      id: stage.title,
      title: stage.title
    }))
  }

  const dealsByFunnel = (funnelId: string) => {
    return deals.value.filter((card) => (card.funnelId ?? 'comercial') === funnelId)
  }

  const totalByFunnel = (funnelId: string) => {
    return dealsByFunnel(funnelId).reduce((sum, card) => sum + card.value, 0)
  }

  const cardsByFunnelColumn = (funnelId: string): Record<string, DealCard[]> => {
    return Object.fromEntries(
      funnelColumns(funnelId).map((column) => [
        String(column.id),
        dealsByFunnel(funnelId).filter((card) => {
          const currentStage = card.funnelStageId ?? stageTitleById(card.stage)
          return currentStage === column.title || String(card.stage) === String(column.id)
        })
      ])
    )
  }

  const moveDeal = (dealId: number, stage: DealStage) => {
    const deal = deals.value.find((item) => item.id === dealId)

    if (!deal || deal.stage === stage) {
      return
    }

    deal.stage = stage
    deal.funnelStageId = stageTitleById(stage)
  }

  const moveDealInFunnel = (dealId: number, funnelId: string, funnelStageId: string) => {
    const deal = deals.value.find((item) => item.id === dealId)

    if (!deal) {
      return
    }

    deal.funnelId = funnelId
    deal.funnelStageId = funnelStageId

    const stageIndex = funnelColumns(funnelId).findIndex((column) => String(column.id) === String(funnelStageId))
    deal.stage = Math.min(Math.max(stageIndex + 1, 1), 6) as DealStage
  }

  const findDealById = (dealId: number) => deals.value.find((item) => item.id === dealId)

  return {
    columns,
    deals,
    totalPipeline,
    cardsByColumn,
    funnelColumns,
    dealsByFunnel,
    totalByFunnel,
    cardsByFunnelColumn,
    moveDeal,
    moveDealInFunnel,
    findDealById
  }
}
