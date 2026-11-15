import type { CustomerCard } from '@/entities/customer'
import type { Money } from '@/shared/api'

export interface ReceiptLine {
  book: string
  title: string
  unitPrice: Money
  quantity: number
}

/** An open receipt. `key` is its operation key: kept across retries, replaced only after a completed sale. */
export interface ReceiptState {
  key: string
  lines: ReceiptLine[]
  selected: number
  customer: CustomerCard | null
}
