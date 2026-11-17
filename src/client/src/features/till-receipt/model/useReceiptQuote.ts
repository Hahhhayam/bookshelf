import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { CustomerCard } from '@/entities/customer'
import { saleApi, type PricedLine } from '@/entities/sale'
import { uah, type Money } from '@/shared/api'
import type { ReceiptLine } from './types'

export interface ReceiptQuote {
  /** Before discounts. */
  subtotal: Money
  discount: Money
  total: Money
  /** How much the customer's bonuses may pay (3.5 step 3), or null without a customer. */
  bonusAllowed: Money | null
  bonusBalance: number | null
  lineOf: (book: string) => PricedLine | undefined
  pending: boolean
  error: unknown
}

const sum = (values: Money[]) => uah(Math.round(values.reduce((s, m) => s + m.amount * 100, 0)) / 100)

/** The server prices the receipt exactly as the sale will: promotions, manual discounts, the bonus write-off. */
export function useReceiptQuote(locationId: string, customer: CustomerCard | null, lines: ReceiptLine[]): ReceiptQuote {
  const items = lines.map(({ book, quantity, manualDiscount }) => ({ book, quantity, manualDiscount }))
  const query = useQuery({
    queryKey: ['till', 'quote', locationId, customer?.id ?? null, items],
    queryFn: () => saleApi.quote({ location: locationId, customer: customer?.id ?? null, items }),
    enabled: lines.length > 0,
    placeholderData: keepPreviousData,
    retry: false,
  })
  const data = lines.length > 0 ? query.data : undefined
  const priced = data?.lines ?? []
  return {
    subtotal: sum(priced.map((l) => uah(l.unitPrice.amount * l.quantity))),
    discount: sum(priced.map((l) => l.discount.amount)),
    total: data?.total ?? uah(0),
    bonusAllowed: data?.bonus?.allowed ?? null,
    bonusBalance: data?.bonus?.balance ?? null,
    lineOf: (book) => priced.find((l) => l.book === book),
    pending: lines.length > 0 && (query.isPending || query.isPlaceholderData || query.isFetching),
    error: lines.length > 0 ? query.error : null,
  }
}
