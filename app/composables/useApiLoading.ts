/** Shared counter for concurrent API queries displayed by the global page overlay. */
export const useApiLoading = () => {
  const pendingQueries = useState<number>('api-pending-queries', () => 0)
  const isQuerying = computed(() => pendingQueries.value > 0)

  const beginQuery = () => {
    pendingQueries.value += 1
  }

  const endQuery = () => {
    pendingQueries.value = Math.max(0, pendingQueries.value - 1)
  }

  return { pendingQueries: readonly(pendingQueries), isQuerying, beginQuery, endQuery }
}
