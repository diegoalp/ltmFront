/** Administrative production report boundary. Laravel owns authorization and aggregation. */
export default defineEventHandler(event => {
  const query = getQuery(event)
  const from = String(query.from || '')
  const to = String(query.to || '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || from > to) {
    throw createError({ statusCode: 422, statusMessage: 'Informe um período válido para o relatório.' })
  }
  return proxyToLaravel(event)
})
