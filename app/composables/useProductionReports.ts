import type { ApiProductionChartItem, ApiProductionReport, ApiProductionReportRow } from '~/types/api'

export interface ProductionReportFilters { from: string, to: string, funnelId: string, userId: string, productId: string, categoryId?: string, sumFieldIds: string[] }
export interface ProductionReportView {
  summary: { totalProduction: number, totalValue: number, averageValue: number, wonCount: number, lostCount: number, openCount: number, totalCount: number, wonValue: number, lostValue: number, openValue: number, conversionRate: number, lossRate: number, overdueOpenCount: number, activityCount: number, completedActivityCount: number }
  rows: ApiProductionReportRow[]
  statusBreakdown: ApiProductionChartItem[]
  dailyBreakdown: NonNullable<ApiProductionReport['daily_breakdown']>
  lossReasons: ApiProductionChartItem[]
  lossesByUser: ApiProductionChartItem[]
  outcomesByProduct: ApiProductionChartItem[]
  customFieldTotals: Record<string, number>
  userPerformance: NonNullable<ApiProductionReport['user_performance']>
  productPerformance: NonNullable<ApiProductionReport['product_performance']>
  categoryPerformance: NonNullable<ApiProductionReport['category_performance']>
  stageBreakdown: NonNullable<ApiProductionReport['stage_breakdown']>
  funnelBreakdown: NonNullable<ApiProductionReport['funnel_breakdown']>
  leadSourceBreakdown: NonNullable<ApiProductionReport['lead_source_breakdown']>
  dispositionBreakdown: NonNullable<ApiProductionReport['disposition_breakdown']>
  activitySummary: NonNullable<ApiProductionReport['activity_summary']>
  meta: { from?: string, to?: string, generatedAt?: string }
}

const numberValue = (value: unknown) => { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0 }

const mapReport = (response: ApiProductionReport): ProductionReportView => {
  const nested = response.data && !Array.isArray(response.data) ? response.data : null
  const rows = response.rows || (Array.isArray(response.data) ? response.data : nested?.rows) || []
  const summary = response.summary || nested?.summary || {}
  return {
    summary: {
      totalProduction: numberValue(summary.total_production ?? summary.total ?? summary.total_count ?? rows.reduce((total, row) => total + numberValue(row.count ?? row.total), 0)),
      totalValue: numberValue(summary.total_value ?? rows.reduce((total, row) => total + numberValue(row.total_value), 0)),
      averageValue: numberValue(summary.average_value), wonCount: numberValue(summary.won_count), lostCount: numberValue(summary.lost_count), openCount: numberValue(summary.open_count),
      totalCount: numberValue(summary.total_count ?? rows.reduce((total, row) => total + numberValue(row.count), 0)), wonValue: numberValue(summary.won_value), lostValue: numberValue(summary.lost_value), openValue: numberValue(summary.open_value), conversionRate: numberValue(summary.conversion_rate), lossRate: numberValue(summary.loss_rate), overdueOpenCount: numberValue(summary.overdue_open_count), activityCount: numberValue(summary.activity_count), completedActivityCount: numberValue(summary.completed_activity_count)
    },
    rows, statusBreakdown: response.status_breakdown || [], dailyBreakdown: response.daily_breakdown || [], lossReasons: response.loss_reasons || [], lossesByUser: response.losses_by_user || [], outcomesByProduct: response.outcomes_by_product || [], customFieldTotals: response.custom_field_totals || {},
    userPerformance: response.user_performance || [], productPerformance: response.product_performance || [], categoryPerformance: response.category_performance || [], stageBreakdown: response.stage_breakdown || [], funnelBreakdown: response.funnel_breakdown || [], leadSourceBreakdown: response.lead_source_breakdown || [], dispositionBreakdown: response.disposition_breakdown || [], activitySummary: response.activity_summary || {},
    meta: { from: response.meta?.from, to: response.meta?.to, generatedAt: response.meta?.generated_at }
  }
}

export const useProductionReports = () => {
  const { request } = useApi()
  const report = useState<ProductionReportView | null>('production-report', () => null)
  const loading = useState('production-report-loading', () => false)
  const error = useState<string | null>('production-report-error', () => null)
  const loadReport = async (filters: ProductionReportFilters) => {
    loading.value = true; error.value = null
    const query = new URLSearchParams({ from: filters.from, to: filters.to })
    if (filters.funnelId) query.set('funnel_id', filters.funnelId)
    if (filters.userId) query.set('user_id', filters.userId)
    if (filters.productId) query.set('product_id', filters.productId)
    if (filters.categoryId) query.set('category_id', filters.categoryId)
    if (filters.sumFieldIds.length) query.set('sum_fields', filters.sumFieldIds.join(','))
    try { report.value = mapReport(await request<ApiProductionReport>(`/reports/production?${query.toString()}`)); return report.value }
    catch (cause) { error.value = cause instanceof Error ? cause.message : 'Não foi possível gerar o relatório.'; return null }
    finally { loading.value = false }
  }
  return { report, loading, error, loadReport }
}
