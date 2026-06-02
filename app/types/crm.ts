export type DealStage = {
  1: 'Lead',
  2: 'Simulação',
  3: 'Documentação',
  4: 'Negociação',
  5: 'Proposta',
  6: 'Fechado'
}

export type Operations = {
  1: 'NOVO',
  2: 'PORTABILIDADE',
  3: 'REFIN',
  4: 'COMPRA DE DÍVIDA'
}

export interface CRMUser {
  id: number
  name: string
  role: string
  initials: string
}

export interface KanbanColumn {
  id: DealStage
  title: string
  limit: number
}

export interface DealCard {
  id: number
  title: string
  company: string
  bank: string
  ownerId: number
  ownerName: string
  stage: keyof DealStage
  operation: keyof Operations
  value: number
  priority: 'low' | 'medium' | 'high'
  dueDate: string
}

export interface LoginPayload {
  email: string
  password: string
}
