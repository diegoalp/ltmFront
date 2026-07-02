export type DealStage = 1 | 2 | 3 | 4 | 5 | 6

export interface CRMCategory {
  id: number
  name: string
  segment: string
  description: string
  active: boolean
}

export type ProductFieldType = 'text' | 'currency' | 'number' | 'group'

export interface ProductSubField {
  label: string
  tipo: Exclude<ProductFieldType, 'group'>
}

export interface ProductField {
  id: string
  label: string
  tipo: ProductFieldType
  obrigatorio: boolean
  subCampos: ProductSubField[]
}

export interface CRMProduct {
  id: number
  name: string
  description: string
  color: string
  categoryIds: number[]
  fields: ProductField[]
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
  categoryId: number
  bank: string
  productId: number
  ownerId: number
  ownerName: string
  stage: DealStage
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

export interface CRMBrandingSettings {
  companyName: string
  logoDataUrl: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
  primaryTextColor: string
}
