import type { HistoryEntry, Money } from '@/shared/api'
import type { StatusTone } from '@/shared/config/tokens'

export type PurchaseOrderStatus = 'Draft' | 'Sent' | 'PartlyReceived' | 'Received' | 'Cancelled'

/** Without a status the list holds every status; `open` keeps only the orders not yet received or cancelled. */
export interface PurchaseOrderFilter {
  status?: PurchaseOrderStatus
  open?: boolean
  overdue?: boolean
}

export interface PurchaseOrderSummary {
  id: string
  supplier: string
  status: PurchaseOrderStatus
  expectedDate: string
  isOverdue: boolean
  lastChangedAt: string | null
  lastChangedBy: string | null
}

export interface PurchaseOrderCard {
  id: string
  supplier: string
  status: PurchaseOrderStatus
  expectedDate: string
  isOverdue: boolean
  lines: { book: string; ordered: number; received: number; purchasePrice: Money }[]
  history: HistoryEntry[]
}

export interface GoodsReceiptSummary {
  id: string
  supplier: string
  location: string
  /** Null for an unplanned delivery. */
  purchaseOrder: string | null
  receivedUnits: number
  hasDiscrepancies: boolean
  confirmedAt: string | null
  confirmedBy: string | null
}

/** A receiving document; the differences from the order are recorded separately (scenario 3.9, step 3). */
export interface GoodsReceiptCard {
  id: string
  supplier: string
  location: string
  purchaseOrder: string | null
  confirmedAt: string | null
  confirmedBy: string | null
  lines: { book: string; ordered: number; received: number }[]
  discrepancies: { id: string; book: string; ordered: number; received: number }[]
}

/** Demand for a book the chain does not have (table 2.7); repeated requests raise `demand`. */
export interface MissingBookRequest {
  id: string
  title: string
  author: string | null
  demand: number
  recordedAt: string
}

export const purchaseOrderStatus: Record<PurchaseOrderStatus, { label: string; tone: StatusTone }> = {
  Draft: { label: 'Чернетка', tone: 'draft' },
  Sent: { label: 'Відправлено постачальнику', tone: 'progress' },
  PartlyReceived: { label: 'Частково отримано', tone: 'progress' },
  Received: { label: 'Отримано', tone: 'done' },
  Cancelled: { label: 'Скасовано', tone: 'problem' },
}

