import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { saleApi } from '@/entities/sale'
import { uah, type Money } from '@/shared/api'
import type { ReceiptLine } from './types'

export interface ReceiptQuote {
  total: Money
  /** False while the client cannot price promotions (GAP-05): the server's total may be lower. */
  exact: boolean
  pending: boolean
  error: unknown
}

export function useReceiptQuote(lines: ReceiptLine[]): ReceiptQuote {
  const quoteLines = lines.map(({ book, title, quantity, unitPrice }) => ({ book, title, quantity, unitPrice }))
  const query = useQuery({
    queryKey: ['till', 'quote', quoteLines.map((l) => [l.book, l.quantity, l.unitPrice.amount])],
    queryFn: () => saleApi.quote(quoteLines),
    enabled: lines.length > 0,
    placeholderData: keepPreviousData,
  })
  if (lines.length === 0) return { total: uah(0), exact: true, pending: false, error: null }
  return {
    total: query.data?.total ?? uah(0),
    exact: query.data?.exact ?? false,
    pending: query.isPending || query.isPlaceholderData,
    error: query.error,
  }
}
