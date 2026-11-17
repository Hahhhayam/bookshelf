import type { CustomerCard } from '@/entities/customer'
import type { Money } from '@/shared/api'

export interface ReceiptLine {
  book: string
  title: string
  unitPrice: Money
  quantity: number
  /** A permitted manual discount off the whole line (FR-04), or null. */
  manualDiscount: Money | null
}

export type ScannedLine = Omit<ReceiptLine, 'quantity' | 'manualDiscount'>

/** An open receipt. `key` is its operation key: kept across retries, replaced only after a completed sale. */
export interface ReceiptState {
  key: string
  lines: ReceiptLine[]
  selected: number
  customer: CustomerCard | null
}
