import type { Money } from '@/shared/api'
import type { StatusTone } from '@/shared/config/tokens'

export interface Availability {
  location: string
  available: number
}

export interface BookHit {
  id: string
  title: string
  price: Money
  availability: Availability[]
}

export type ItemType = 'Book' | 'Other'
export type SaleStatus = 'Active' | 'Deactivated'

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
