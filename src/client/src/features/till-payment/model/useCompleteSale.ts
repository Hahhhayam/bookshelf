import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saleApi, saleKeys, type Payment } from '@/entities/sale'
import { fromCents, toCents } from '@/shared/lib'

export interface SaleAttempt {
  /** The receipt's operation key, the same on every retry of this receipt. */
  key: string
  location: string
  customer: string | null
  lines: { book: string; quantity: number }[]
  payments: Payment[]
}

/** Posts the receipt and remembers it for "my receipts" (no sale list in the API yet, GAP-07). */
export function useCompleteSale() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ key, location, customer, lines, payments }: SaleAttempt) =>
      saleApi.complete({
        location, customer, payments,
        items: lines.map(({ book, quantity }) => ({ book, quantity, manualDiscount: null })),
      }, key),
    onSuccess: async ({ id }, attempt) => {
      saleApi.rememberReceipt({
        id,
        at: new Date().toISOString(),
        location: attempt.location,
        items: attempt.lines.reduce((sum, line) => sum + line.quantity, 0),
        total: fromCents(attempt.payments.reduce((sum, p) => sum + toCents(p.amount), 0)),
        methods: [...new Set(attempt.payments.map((p) => p.method))],
      })
      await client.invalidateQueries({ queryKey: saleKeys.shift })
    },
  })
}
