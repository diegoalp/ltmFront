import type { CRMCustomField, DealCard } from './crm'

export interface ApiPaginatedResponse<T> { data: T[], current_page?: number, last_page?: number, total?: number, meta?: { last_page?: number } }
export type ApiCollectionResponse<T> = ApiPaginatedResponse<T> | T[]
export interface ApiResourceResponse<T> { data: T }
/** Canonical business status codes returned by the Laravel API. */
export const BUSINESS_STATUS = { OPEN: 1, LOST: 2, WON: 3 } as const
export type ApiBusinessStatus = typeof BUSINESS_STATUS[keyof typeof BUSINESS_STATUS]
export interface ApiUser { id: number, name: string, lastname?: string | null, type?: string, instance_id?: number | string | null, funnel_id?: number | string | null }
export interface ApiInstance { id: number | string, name: string, expiration_date?: string | null, is_expired?: boolean, is_principal?: boolean }
export interface ApiStage { id: number, funnel_id: number, name: string, color?: string | null, position: number, duration?: number | null, durationUnit?: string | null, is_final?: boolean }
export interface ApiFunnel { id: number, name: string, description?: string | null, ownerTeam?: string | null, color?: string | null, active?: boolean, stages?: ApiStage[] }
export interface ApiLeadSource { id: number, name: string, type: string, description?: string | null }
export interface ApiDisposition extends ApiLeadSource { active: boolean }
export interface ApiTeam { id: number, name: string, description?: string | null }
export interface ApiAdminUser extends ApiUser { email: string, team_id?: number | null, funnel_id?: number | null, supervisor_id?: number | null }
export interface ApiCustomField {
  id: number
  label: string
  section: CRMCustomField['section']
  custom_field_section_id?: number | null
  form_section?: string | null
  form_section_order?: number | null
  type: CRMCustomField['type']
  required: boolean
  default_value?: boolean | null
  is_business_value?: boolean | number | string | null
  isBusinessValue?: boolean | number | string | null
  visible_when: string
  conditions?: Array<Omit<CRMCustomField['conditions'][number], 'value'> & { value: string | string[] }>
  options?: string[]
  sub_fields?: CRMCustomField['subFields']
  position?: number | null
}
export interface ApiCustomFieldSection { id: number, name: string, section: string, position?: number | null }
export interface ApiPermissionRole { id: number, name: string, description?: string | null, permissions: Record<string, boolean> }
export interface ApiTask { id: number, title: string, priority: 'low' | 'medium' | 'high', due_at?: string | null, business?: { client?: { fullname?: string } }, owner?: { name?: string } }
export interface ApiProductionReportSummary { total_production?: number, total_value?: number, average_value?: number, won_count?: number, lost_count?: number, open_count?: number, total_count?: number, won_value?: number, lost_value?: number, open_value?: number, conversion_rate?: number, loss_rate?: number, overdue_open_count?: number, activity_count?: number, completed_activity_count?: number, [key: string]: unknown }
export interface ApiProductionReportRow { id?: number | string, user_id?: number | string | null, user_name?: string | null, product_id?: number | string | null, product_name?: string | null, total?: number, total_value?: number, count?: number, won_count?: number, lost_count?: number, custom_fields?: Record<string, unknown>, [key: string]: unknown }
export interface ApiProductionBusinessSummary { id: number, client_name?: string, product_name?: string, product_color?: string | null, user_name?: string, stage_name?: string, stage_color?: string | null, value?: number, created_at?: string | null, loss_reason?: string | null }
export interface ApiProductionChartItem { label?: string, status?: number, count?: number, total_value?: number, businesses?: ApiProductionBusinessSummary[], user_id?: number | string | null, user_name?: string | null, product_id?: number | string | null, product_name?: string | null, won_count?: number, lost_count?: number, open_count?: number, total_count?: number }
export interface ApiProductionPerformanceRow extends ApiProductionChartItem { id?: number | string | null, label?: string, conversion_rate?: number, activity_count?: number, completed_activity_count?: number, won_value?: number }
export interface ApiProductionDailyRow { date?: string, label?: string, total_count?: number, won_count?: number, lost_count?: number, open_count?: number, total_value?: number }
export interface ApiProductionReport { summary?: ApiProductionReportSummary, rows?: ApiProductionReportRow[], data?: ApiProductionReportRow[] | { summary?: ApiProductionReportSummary, rows?: ApiProductionReportRow[] }, status_breakdown?: ApiProductionChartItem[], daily_breakdown?: ApiProductionDailyRow[], loss_reasons?: ApiProductionChartItem[], losses_by_user?: ApiProductionChartItem[], outcomes_by_product?: ApiProductionChartItem[], user_performance?: ApiProductionPerformanceRow[], product_performance?: ApiProductionPerformanceRow[], category_performance?: ApiProductionPerformanceRow[], stage_breakdown?: ApiProductionPerformanceRow[], funnel_breakdown?: ApiProductionPerformanceRow[], lead_source_breakdown?: ApiProductionPerformanceRow[], disposition_breakdown?: ApiProductionPerformanceRow[], activity_summary?: { total?: number, completed?: number, pending?: number, cancelled?: number }, custom_field_totals?: Record<string, number>, meta?: { from?: string, to?: string, generated_at?: string, [key: string]: unknown } }
export interface ApiDocument { id: number, title: string, file: string, type: string, object_id: number | string, disk?: string | null, file_url?: string | null, download_url?: string | null, url?: string | null, original_name?: string | null, mime_type?: string | null, created_at?: string | null }
export interface ApiActivityType { id: number, activity_type: string, funnel_ids: number[], color?: string | null, active?: boolean }
export interface ApiDocumentType { id: number, name: string, active?: boolean }
export interface ApiNote { id: number, body: string, business_id: number, created_at: string, user?: { id?: number, name?: string } | null }
export interface ApiActivity { id: number, title: string, description?: string | null, scheduled_at: string, status: 'pending' | 'completed' | 'cancelled', business_id: number, user_id: number, business_name?: string | null, completed_at?: string | null, activity_type_id: number, activity_type?: ApiActivityType | null, user?: { id?: number, name?: string } | null }
export interface ApiPublicForm { id: number, name: string, headline: string, channel?: string | null, funnel_id: number, fields?: string[], active: boolean }
export interface ApiChecklistItem { id: number, checklist_id?: number, label: string, position: number, required: boolean }
export interface ApiChecklistCondition { id?: number, funnel_id: number, product_ids?: number[], min_stage_id?: number | null }
export interface ApiChecklist { id: number, instance_id: number, title: string, description?: string | null, active: boolean, funnels?: Array<{ id: number, name?: string }>, items?: ApiChecklistItem[], conditions?: ApiChecklistCondition[], created_at?: string, updated_at?: string }
export interface ApiBusinessChecklistItem extends ApiChecklistItem { done: boolean, completed_at?: string | null, completed_by?: number | null }
export interface ApiBusinessChecklist { id: number, title: string, description?: string | null, items: ApiBusinessChecklistItem[] }

export interface ApiBusiness {
  id: number, client_id: number, user_id: number, category_id: number, product_id: number | null, funnel_id: number, stage_id: number, lead_source_id?: number | null,
  status: number, value: number, notes?: string | null, priority?: DealCard['priority'], dueDate?: string | null, expiration_date?: string | null, lossReason?: string | null,
  customData?: Record<string, unknown>, custom_data?: Record<string, unknown>, created_at: string,
  client?: { fullname: string, type: 'individual' | 'company', registration: string, birthdate?: string, gender?: string, profession?: string, street?: string, district?: string, city?: string, state?: string, zipcode?: string, extra?: Record<string, unknown>, customData?: Record<string, unknown>, custom_data?: Record<string, unknown>, phones?: Array<{ number: string }> },
  user?: { name: string, lastname?: string }, funnel?: { id: number }, stage?: { id: number, name: string, position: number },
  timeline?: DealCard['timeline'], conversation?: DealCard['conversation']
}

export interface ApiActivityAssignee { id: number, name: string }
