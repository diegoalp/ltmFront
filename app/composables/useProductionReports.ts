import type { ApiProductionChartItem, ApiProductionReport, ApiProductionReportRow, ApiSavedReport } from '~/types/api'

export interface ProductionReportFilter { fieldId: string, operator: 'equals' | 'contains' | 'gte' | 'lte', value: string }
export interface ProductionReportFilters { from: string, to: string, userId: string, productId: string, customFilters: ProductionReportFilter[], sumFieldIds: string[] }
export interface ProductionReportView {
  summary: { totalProduction: number, totalValue: number, averageValue: number, wonCount: number, lostCount: number, openCount: number, totalCount: number }
  rows: ApiProductionReportRow[]
  statusBreakdown: ApiProductionChartItem[]
  lossReasons: ApiProductionChartItem[]
  lossesByUser: ApiProductionChartItem[]
  outcomesByProduct: ApiProductionChartItem[]
  customFieldTotals: Record<string, number>
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
      totalCount: numberValue(summary.total_count ?? rows.reduce((total, row) => total + numberValue(row.count), 0))
    },
    rows, statusBreakdown: response.status_breakdown || [], lossReasons: response.loss_reasons || [], lossesByUser: response.losses_by_user || [], outcomesByProduct: response.outcomes_by_product || [], customFieldTotals: response.custom_field_totals || {},
    meta: { from: response.meta?.from, to: response.meta?.to, generatedAt: response.meta?.generated_at }
  }
}

export const useProductionReports = () => {
  const { request } = useApi()
  const report = useState<ProductionReportView | null>('production-report', () => null)
  const loading = useState('production-report-loading', () => false)
  const error = useState<string | null>('production-report-error', () => null)
  const savedReports = useState<ApiSavedReport[]>('saved-production-reports', () => [])
  const savedLoading = useState('saved-production-reports-loading', () => false)
  const loadReport = async (filters: ProductionReportFilters) => {
    loading.value = true; error.value = null
    const query = new URLSearchParams({ from: filters.from, to: filters.to })
    if (filters.userId) query.set('user_id', filters.userId)
    if (filters.productId) query.set('product_id', filters.productId)
    if (filters.customFilters.length) query.set('custom_filters', JSON.stringify(filters.customFilters))
    if (filters.sumFieldIds.length) query.set('sum_fields', filters.sumFieldIds.join(','))
    try { report.value = mapReport(await request<ApiProductionReport>(`/reports/production?${query.toString()}`)); return report.value }
    catch (cause) { error.value = cause instanceof Error ? cause.message : 'Não foi possível gerar o relatório.'; return null }
    finally { loading.value = false }
  }
  const loadSavedReports = async () => {
    savedLoading.value = true
    try {
      const response = await request<{ data: ApiSavedReport[] }>('/reports/saved')
      savedReports.value = Array.isArray(response.data) ? response.data : []
    } finally { savedLoading.value = false }
  }
  const saveReport = async (name: string, filters: ProductionReportFilters) => {
    await request('/reports/saved', { method: 'POST', body: { name, filters } })
    await loadSavedReports()
  }
  const deleteSavedReport = async (id: number) => {
    await request(`/reports/saved/${id}`, { method: 'DELETE' })
    savedReports.value = savedReports.value.filter(item => item.id !== id)
  }
  return { report, loading, error, loadReport, savedReports, savedLoading, loadSavedReports, saveReport, deleteSavedReport }
}
