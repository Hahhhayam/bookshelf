import { useQueries, useQuery } from '@tanstack/react-query'
import { uah, type Money } from '@/shared/api'
import { purchaseOrderApi } from '../api/purchaseOrderApi'
import type { PurchaseOrderCard, PurchaseOrderStatus } from './types'

export const purchaseOrderKeys = {
  all: ['purchase-orders'] as const,
  list: (filter: { status?: PurchaseOrderStatus; overdue?: boolean }) => ['purchase-orders', 'list', filter] as const,
  card: (id: string) => ['purchase-orders', 'card', id] as const,
}

export function usePurchaseOrders(filter: { status?: PurchaseOrderStatus; overdue?: boolean } = {}) {
  return useQuery({ queryKey: purchaseOrderKeys.list(filter), queryFn: () => purchaseOrderApi.list(filter) })
}

export function usePurchaseOrder(id: string | undefined) {
  return useQuery({ queryKey: purchaseOrderKeys.card(id ?? ''), queryFn: () => purchaseOrderApi.card(id!), enabled: !!id })
}

/**
 * Order totals for a list. The list returns no sums (GAP-37), so each row reads its card once; the cards share
 * the cache with the order page.
 */
export function useOrderTotals(ids: readonly string[]): (id: string) => Money | undefined {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: purchaseOrderKeys.card(id),
      queryFn: () => purchaseOrderApi.card(id),
      staleTime: 60_000,
    })),
  })
  const totals = new Map<string, Money>()
  ids.forEach((id, i) => {
    const card = results[i]?.data
    if (card) totals.set(id, orderTotal(card))
  })
  return (id) => totals.get(id)
}

function orderTotal(card: PurchaseOrderCard): Money {
  const first = card.lines[0]
  if (!first) return uah(0)
  const amount = card.lines.reduce((sum, line) => sum + line.ordered * line.purchasePrice.amount, 0)
  return { amount, currency: first.purchasePrice.currency }
}
