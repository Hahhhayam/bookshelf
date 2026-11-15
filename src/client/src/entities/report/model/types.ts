import type { Money } from '@/shared/api'

export interface ReportFilter {
  from: string
  to: string
  locations: string[]
  category?: string
  book?: string
}

export interface ManagementReport {
  revenue: Money
  margin: Money
  receipts: number
  averageCheck: Money
  daysOfStock: number | null
  topBooks: { book: string; sold: number; revenue: Money }[]
  slowMovingBooks: string[]
  shortages: { location: string; book: string; onHand: number; minimum: number }[]
  abc: { book: string; revenue: Money; cumulativeShare: number; class: 'A' | 'B' | 'C' }[]
  stores: { location: string; revenue: Money; margin: Money; receipts: number; averageCheck: Money }[]
  categories: { category: string | null; sold: number; revenue: Money }[]
}
