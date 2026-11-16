import type { HistoryEntry, Money } from '@/shared/api'
import type { StatusTone } from '@/shared/config/tokens'

export type PurchaseOrderStatus = 'Draft' | 'Sent' | 'PartlyReceived' | 'Received' | 'Cancelled'

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

export const purchaseOrderStatus: Record<PurchaseOrderStatus, { label: string; tone: StatusTone }> = {
  Draft: { label: 'Чернетка', tone: 'draft' },
  Sent: { label: 'Відправлено постачальнику', tone: 'progress' },
  PartlyReceived: { label: 'Частково отримано', tone: 'progress' },
  Received: { label: 'Отримано', tone: 'done' },
  Cancelled: { label: 'Скасовано', tone: 'problem' },
}

