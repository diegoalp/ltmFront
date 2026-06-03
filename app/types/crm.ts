export type DealStage = 1 | 2 | 3 | 4 | 5 | 6

export interface Operations {
  id: number
  name: string,
  color: string
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
}

export interface DealCard {
  id: number
  title: string
  company: string
  bank: string
  ownerId: number
  ownerName: string
  stage: DealStage
  operation: Operations
  value: number
  priority: 'low' | 'medium' | 'high'
  dueDate: string,
}

export interface LoginPayload {
  email: string
  password: string
}
