import type { DealCard } from '~/types/crm'

export const useBusinessExpiration = () => {
  const deals = useState<DealCard[]>('kanban-deals', () => [])
  const now = useState('business-expiration-now', () => Date.now())
  const session = useSessionStore()
  const isExpired = (deal: DealCard) => Boolean(deal.expirationDate && Date.parse(deal.expirationDate) < now.value)
  const expiredOwnDeals = computed(() => session.user
    ? deals.value.filter(deal => String(deal.ownerId) === String(session.user!.id) && isExpired(deal))
    : [])
  const hasExpiredDeals = computed(() => expiredOwnDeals.value.length > 0)
  const isDealDisabled = (deal: DealCard) => hasExpiredDeals.value && !isExpired(deal)
  return { now, isExpired, expiredOwnDeals, hasExpiredDeals, isDealDisabled }
}
