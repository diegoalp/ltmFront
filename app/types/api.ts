import type { DealCard } from './crm'

export interface ApiPaginatedResponse<T> { data: T[], current_page?: number, last_page?: number, total?: number, meta?: { last_page?: number } }
export type ApiCollectionResponse<T> = ApiPaginatedResponse<T> | T[]
export interface ApiResourceResponse<T> { data: T }
export interface ApiUser { id: number, name: string, lastname?: string | null, type?: string, instance_id?: number | string | null, funnel_id?: number | string | null }
export interface ApiInstance { id: number | string, name: string, expiration_date?: string | null, is_expired?: boolean }
export interface ApiStage { id: number, funnel_id: number, name: string, color?: string | null, position: number, duration?: number | null, durationUnit?: string | null, is_final?: boolean }
export interface ApiFunnel { id: number, name: string, description?: string | null, ownerTeam?: string | null, color?: string | null, active?: boolean, stages?: ApiStage[] }
export interface ApiLeadSource { id: number, name: string, type: string, description?: string | null }
export interface ApiDisposition extends ApiLeadSource { active: boolean }
export interface ApiTeam { id: number, name: string, description?: string | null }
export interface ApiAdminUser extends ApiUser { email: string, team_id?: number | null, funnel_id?: number | null, supervisor_id?: number | null }
export interface ApiCustomField { id: number, label: string, section: string, type: string, required: boolean, default_value?: boolean | null, is_business_value?: boolean, visible_when: string, conditions?: Array<{ field: string, operator: string, value: string[] }>, options?: string[], sub_fields?: Array<{ key: string, label: string, type: string, required: boolean, options?: string[], position: number }> }
export interface ApiAutomation { id: number, name: string, trigger: string, condition: string, action: string, active: boolean }
export interface ApiPermissionRole { id: number, name: string, description?: string | null, permissions: Record<string, boolean> }
export interface ApiTask { id: number, title: string, priority: 'low' | 'medium' | 'high', due_at?: string | null, business?: { client?: { fullname?: string } }, owner?: { name?: string } }
export interface ApiDocument { id: number, title: string, file: string, type: string, object_id: number | string, file_url?: string | null, url?: string | null, original_name?: string | null, mime_type?: string | null, created_at?: string | null }
export interface ApiActivityType { id: number, activity_type: string, funnel_ids: number[], color?: string | null, active?: boolean }
export interface ApiDocumentType { id: number, name: string, active?: boolean }
export interface ApiNote { id: number, body: string, business_id: number, created_at: string, user?: { id?: number, name?: string } | null }
export interface ApiActivity { id: number, title: string, description?: string | null, scheduled_at: string, status: 'pending' | 'completed' | 'cancelled', business_id: number, user_id: number, business_name?: string | null, completed_at?: string | null, activity_type_id: number, activity_type?: ApiActivityType | null, user?: { id?: number, name?: string } | null }
export interface ApiPublicForm { id: number, name: string, headline: string, channel?: string | null, funnel_id: number, fields?: string[], active: boolean }

export interface ApiBusiness {
  id: number, client_id: number, user_id: number, category_id: number, product_id: number | null, funnel_id: number, stage_id: number,
  status: number, value: number, priority?: DealCard['priority'], dueDate?: string | null, expiration_date?: string | null, lossReason?: string | null,
  customData?: Record<string, unknown>, custom_data?: Record<string, unknown>, created_at: string,
  client?: { fullname: string, type: 'individual' | 'company', registration: string, birthdate?: string, gender?: string, profession?: string, street?: string, district?: string, city?: string, state?: string, zipcode?: string, extra?: Record<string, unknown>, customData?: Record<string, unknown>, custom_data?: Record<string, unknown>, phones?: Array<{ number: string }> },
  user?: { name: string, lastname?: string }, funnel?: { id: number }, stage?: { id: number, name: string, position: number },
  timeline?: DealCard['timeline'], conversation?: DealCard['conversation']
}

export interface ApiActivityAssignee { id: number, name: string }
