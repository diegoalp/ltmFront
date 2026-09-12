export type DealStage = 1 | 2 | 3 | 4 | 5 | 6

export interface CRMCategory {
  id: number
  name: string
  segment: string
  description: string
  active: boolean
  funnelIds: string[]
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
  funnelIds: string[]
  fields: ProductField[]
}

export interface CRMUser {
  id: number | string
  name: string
  role: string
  initials: string
  instanceId?: number | string | null
  funnelId?: number | string | null
}

export interface CRMInstance { id: number | string, name: string, expirationDate?: string | null, isExpired?: boolean }

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

export interface CRMDocument {
  id: number
  title: string
  type: string
  objectId: number | string
  fileName: string
  fileUrl: string
  downloadUrl: string
  mimeType: string | null
  createdAt: string | null
}

export interface CRMCatalogItem { id: number, name: string, color?: string | null, active: boolean }
export interface CRMActivityType extends CRMCatalogItem { funnelIds: string[] }
export interface CRMNote { id: number, body: string, authorName: string, createdAt: string }
export interface CRMActivity { id: number, title: string, description: string, scheduledAt: string, status: 'pending' | 'completed' | 'cancelled', activityTypeId: number, activityTypeName: string, activityTypeColor: string, ownerName: string }

export interface KanbanColumn {
  id: DealStage | string
  title: string
  isFinal?: boolean
}

export interface DealCard {
  id: number
  clientId: number
  title: string
  clientType: 'individual' | 'company'
  phone: string
  document: string
  birthDate: string
  categoryId: number
  bank: string
  productId: number | null
  ownerId: number
  ownerName: string
  stage: DealStage
  funnelId?: string
  funnelStageId?: string
  value: number
  notes?: string | null
  leadSourceId?: number | null
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  expirationDate?: string | null
  createdAt: string
  timeline: DealTimelineItem[]
  status?: 'active' | 'lost' | 'won'
  lossReason?: string | null
  conversation?: DealConversationMessage[]
  customFields: Record<string, unknown>
  clientCustomFields: Record<string, unknown>
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
  id?: number
  title: string
  expirationLabel: string
  color?: string | null
  isFinal?: boolean
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
export type CRMCustomFieldSection = 'business' | 'product' | 'client'
export type CRMCustomSubFieldType = Exclude<CRMCustomFieldType, 'group'>
export interface CRMCustomSubField {
  key: string
  label: string
  type: CRMCustomSubFieldType
  required: boolean
  options: string[]
  position: number
}
export interface CRMCustomFieldCondition {
  field: 'category_id' | 'product_id' | 'funnel_id'
  operator: 'equals' | 'not_equals'
  value: string[]
}

export interface CRMCustomField {
  id: string
  label: string
  section: CRMCustomFieldSection
  customFieldSectionId: string | null
  formSection: string | null
  formSectionOrder: number
  type: CRMCustomFieldType
  required: boolean
  defaultValue: boolean | null
  isBusinessValue: boolean
  visibleWhen: string
  conditions: CRMCustomFieldCondition[]
  options: string[]
  subFields: CRMCustomSubField[]
  position: number
}

export interface CRMCustomFieldSectionConfig {
  id: string
  name: string
  section: CRMCustomFieldSection
  position: number
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
