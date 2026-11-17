import type { Money } from '@/shared/api'
import type { StatusTone } from '@/shared/config/tokens'

export interface Availability {
  location: string
  available: number
}

export type ItemType = 'Book' | 'Other'
export type SaleStatus = 'Active' | 'Deactivated'

export interface BookHit {
  id: string
  title: string
  price: Money
  barcode: string
  status: SaleStatus
  availability: Availability[]
}

export const saleStatus: Record<SaleStatus, { label: string; tone: StatusTone }> = {
  Active: { label: 'Активна', tone: 'ready' },
  Deactivated: { label: 'Деактивована', tone: 'done' },
}

export interface BookCard {
  id: string
  title: string
  price: Money
  isbn: string | null
  barcode: string
  itemType: ItemType
  status: SaleStatus
  publisher: string | null
  category: string
  authors: string[]
  availability: Availability[]
  /** A price decided to start later (scenario 3.3); the current one stays until then. */
  scheduledPrice: { price: Money; effectiveFrom: string } | null
}

export interface PricePoint {
  price: Money
  validFrom: string
}

export interface BookSearch {
  text?: string
  isbn?: string
  author?: string
  publisher?: string
  category?: string
  availableAt?: string
  /** A batch lookup by id; finds deactivated books too, like the card. */
  ids?: string[]
  /** Deactivated books as well (catalog staff only). */
  includeInactive?: boolean
}

export interface BookDraft {
  title: string
  itemType: ItemType
  barcode: string
  category: string
  authors: string[]
  publisher: string | null
  isbn: string | null
  price: Money
}

export type RemovalMode = 'Deactivate' | 'Delete'
