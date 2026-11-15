import type { Money } from '@/shared/api'
import type { FulfilmentKind } from '@/entities/order'

/** What the confirmation page shows, handed over in navigation state: the API returns only id and pickup code (GAP-25). */
export interface PlacedOrderSummary {
  id: string
  pickupCode: string
  lines: { book: string; title: string; quantity: number; price: Money }[]
  total: Money
  store: string | null
  kind: FulfilmentKind
  deliveryAddress: string | null
}

export function asPlacedOrderSummary(state: unknown): PlacedOrderSummary | null {
  if (typeof state !== 'object' || state === null) return null
  const candidate = state as Partial<PlacedOrderSummary>
  return typeof candidate.pickupCode === 'string' && Array.isArray(candidate.lines) && !!candidate.total
    ? (candidate as PlacedOrderSummary)
    : null
}
