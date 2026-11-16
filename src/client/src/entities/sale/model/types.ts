import type { Money } from '@/shared/api'

export type PaymentMethod = 'Cash' | 'Card' | 'GiftCertificate' | 'Bonus'
export type ItemCondition = 'New' | 'Good' | 'Damaged'

export interface SaleItem {
  book: string
  quantity: number
  manualDiscount: Money | null
}

export interface Payment {
  method: PaymentMethod
  amount: Money
  giftCertificateNumber: string | null
}

export interface SaleDraft {
  location: string
  customer: string | null
  items: SaleItem[]
  payments: Payment[]
}

/** A receipt the till completed in this browser (the API cannot list sales yet: GAP-07). */
export interface ShiftReceipt {
  id: string
  at: string
  location: string
  items: number
  total: Money
  methods: PaymentMethod[]
}

/** A return created in this browser and not yet confirmed (GAP-16). */
export interface PendingReturn {
  id: string
  sale: string
  book: string
  title: string
  quantity: number
  reason: string
  condition: ItemCondition
  at: string
}

/** What the till shows before payment. `exact` is false while promotions are unknown to the client (GAP-05). */
export interface SaleQuote {
  lines: { book: string; title: string; quantity: number; unitPrice: Money; total: Money }[]
  total: Money
  exact: boolean
}

export const paymentLabel: Record<PaymentMethod, string> = {
  Cash: 'Готівка',
  Card: 'Картка',
  GiftCertificate: 'Сертифікат',
  Bonus: 'Бонуси',
}

export const conditionLabel: Record<ItemCondition, string> = {
  New: 'Нова',
  Good: 'Добрий стан',
  Damaged: 'Пошкоджена',
}
