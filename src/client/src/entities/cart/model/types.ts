import type { Money } from '@/shared/api'

/** A cart line at the current catalog price; the order fixes the price when it is placed. */
export interface CartLine {
  book: string
  title: string
  quantity: number
  unitPrice: Money
}

export interface Cart {
  lines: CartLine[]
  /** Null for an empty cart. */
  total: Money | null
}
