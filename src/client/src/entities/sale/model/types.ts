import type { Money } from '@/shared/api'

export type PaymentMethod = 'Cash' | 'Card' | 'GiftCertificate' | 'Bonus'
export type ItemCondition = 'New' | 'Good' | 'Damaged'
export type SaleStatus = 'Completed' | 'Cancelled'
export type ReturnStatus = 'Pending' | 'Confirmed'
export type DiscountSource = 'None' | 'Manual' | 'Promotion'

export interface SaleItem {
  book: string
  quantity: number
  manualDiscount: Money | null
}

export interface Payment {
  method: PaymentMethod
  amount: Money
  giftCertificateNumber: string | null
  /** Cash handed over when it is more than `amount`; the server records the change. */
  tendered: Money | null
}

export interface SaleDraft {
  location: string
  customer: string | null
  items: SaleItem[]
  payments: Payment[]
}

export interface QuoteRequest {
  location: string
  customer: string | null
  items: SaleItem[]
}

export interface PricedLine {
  book: string
  quantity: number
  unitPrice: Money
  discount: { amount: Money; source: DiscountSource }
  total: Money
}

/** The receipt priced exactly as the sale will be: promotions, manual discounts and the allowed bonus write-off. */
export interface SaleQuote {
  lines: PricedLine[]
  total: Money
  /** Null without a customer; `balance` in points, `allowed` is how much of the receipt they may pay. */
  bonus: { balance: number; allowed: Money } | null
}

export interface SaleSummary {
  id: string
  cashier: string
  customer: string | null
  completedAt: string
  status: SaleStatus
  total: Money
}

export interface SalePayment {
  id: string
  method: PaymentMethod
  amount: Money
  status: 'Pending' | 'Captured' | 'Failed'
  tendered: Money
  change: Money
}

export interface SaleView extends SaleSummary {
  location: string
  lines: PricedLine[]
  payments: SalePayment[]
}

export interface ReturnView {
  id: string
  sale: string
  customer: string | null
  reason: string
  condition: ItemCondition
  status: ReturnStatus
  refundTotal: Money
  lines: { book: string; quantity: number; unitRefund: Money; refund: Money }[]
}

/** The store's till: open while a shift is open (3.5 «Каса відкрита»). */
export interface Shift {
  open: boolean
  id: string | null
  openedAt: string | null
  openedBy: string | null
}

export interface GiftCertificate {
  id: string
  number: string
  balance: Money
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

export const saleStatusLabel: Record<SaleStatus, string> = {
  Completed: 'Проведено',
  Cancelled: 'Анульовано',
}

export const discountSourceLabel: Record<DiscountSource, string> = {
  None: '',
  Manual: 'Ручна знижка',
  Promotion: 'Акція',
}
