import { isWaitingTooLong, type OrderStatus, type OrderSummary } from '@/entities/order'
import { minutesSince, shortId } from '@/shared/lib'

export type BoardView = 'board' | 'list'

export interface BoardFilters {
  view: BoardView
  search: string
  lateOnly: boolean
  status: OrderStatus | null
}

export const initialFilters: BoardFilters = { view: 'board', search: '', lateOnly: false, status: null }

export const isLate = (order: OrderSummary) =>
  order.lastChangedAt !== null && isWaitingTooLong(order.status, minutesSince(order.lastChangedAt))

/**
 * The search as a pickup code: 32 letters and digits without hyphens, as the customer reads it out (spaces ignored).
 * An order id has hyphens, so it is never mistaken for one.
 */
export function pickupCodeOf(search: string): string | undefined {
  const compact = search.replace(/\s/g, '').toLowerCase()
  return /^[0-9a-f]{32}$/.test(compact) ? compact : undefined
}

/** Local filters; a pickup code is looked up by the server instead, so it matches whatever was found. */
export function matches(order: OrderSummary, filters: BoardFilters) {
  const text = filters.search.trim().toUpperCase()
  const found = !text || !!pickupCodeOf(filters.search)
    || shortId(order.id).includes(text) || shortId(order.customer).includes(text) || order.id.toUpperCase().includes(text)
  return found && (!filters.lateOnly || isLate(order))
}
