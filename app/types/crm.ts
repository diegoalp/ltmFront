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

export interface DealTimelineItem {
  id: number
  date: string
  title: string
  userName: string
}

export interface KanbanColumn {
  id: DealStage
  title: string
}

export interface DealCard {
  id: number
  title: string
  phone: string
  document: string
  birthDate: string
  company: string
  bank: string
  ownerId: number
  ownerName: string
  stage: DealStage
  operation: Operations
  value: number
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
  timeline: DealTimelineItem[]
}

export interface LoginPayload {
  email: string
  password: string
}
