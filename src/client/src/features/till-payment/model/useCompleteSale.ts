import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saleApi, saleKeys, type Payment, type SaleItem } from '@/entities/sale'

export interface SaleAttempt {
  /** The receipt's operation key, the same on every retry of this receipt. */
  key: string
  location: string
  customer: string | null
  items: SaleItem[]
  payments: Payment[]
}

export function useCompleteSale() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ key, location, customer, items, payments }: SaleAttempt) =>
      saleApi.complete({ location, customer, items, payments }, key),
    onSuccess: () => client.invalidateQueries({ queryKey: saleKeys.lists }),
  })
}
