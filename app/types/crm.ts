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
  id: number | string
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

export interface DealConversationMessage {
  id: number
  sender: 'customer' | 'agent'
  text: string
  timestamp: string
}

export interface KanbanColumn {
  id: DealStage | string
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
  funnelId?: string
  funnelStageId?: string
  value: number
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
  timeline: DealTimelineItem[]
  status?: 'active' | 'lost'
  lossReason?: string | null
  conversation?: DealConversationMessage[]
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

export interface OperationTemplateStage {
  title: string
  expirationLabel: string
}

export interface OperationTemplateField {
  label: string
  type: ProductFieldType | 'date' | 'select' | 'file' | 'phone' | 'document'
  required: boolean
}

export interface OperationTemplateAutomation {
  trigger: string
  action: string
}

export interface OperationTemplate {
  id: string
  name: string
  segment: string
  description: string
  accentClass: string
  stages: OperationTemplateStage[]
  fields: OperationTemplateField[]
  automations: OperationTemplateAutomation[]
  dashboards: string[]
  products: string[]
  lossReasons: string[]
}

export interface InstalledOperationTemplate {
  templateId: string
  installedAt: string
}

export interface CRMFunnel {
  id: string
  name: string
  description: string
  ownerTeam: string
  colorClass: string
  stages: OperationTemplateStage[]
  active: boolean
}

export type CRMCustomFieldType = OperationTemplateField['type'] | 'textarea' | 'checkbox'

export interface CRMCustomField {
  id: string
  label: string
  section: string
  type: CRMCustomFieldType
  required: boolean
  visibleWhen: string
}

export interface CRMAutomationRule {
  id: string
  name: string
  trigger: string
  condition: string
  action: string
  active: boolean
}

export interface CRMPermissionRole {
  id: string
  name: string
  description: string
  permissions: Record<string, boolean>
}

export interface CRMTask {
  id: number
  title: string
  dealTitle: string
  ownerName: string
  dueLabel: string
  priority: 'low' | 'medium' | 'high'
}

export interface CRMPublicLeadForm {
  id: string
  name: string
  headline: string
  channel: string
  assignedFunnelId: string
  fields: string[]
  active: boolean
}
