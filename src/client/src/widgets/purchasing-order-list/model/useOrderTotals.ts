import { useQueries } from '@tanstack/react-query'
import { purchaseOrderApi, purchaseOrderKeys } from '@/entities/purchase-order'
import { uah, type Money } from '@/shared/api'

/**
 * Order totals for the list. The list returns no sums (GAP-37), so each row reads its card once; the cards share
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
    if (!card) return
    const amount = card.lines.reduce((sum, line) => sum + line.ordered * line.purchasePrice.amount, 0)
    totals.set(id, card.lines[0] ? { amount, currency: card.lines[0].purchasePrice.currency } : uah(0))
  })
  return (id) => totals.get(id)
}
