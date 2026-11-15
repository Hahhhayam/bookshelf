import type { HistoryEntry } from '@/shared/api'
import type { StatusTone } from '@/shared/config/tokens'

export type TransferStatus = 'Created' | 'Approved' | 'Shipped' | 'Received'

export interface TransferSummary {
  id: string
  from: string
  to: string
  status: TransferStatus
  hasOpenDiscrepancies: boolean
  lastChangedAt: string | null
  lastChangedBy: string | null
}

export interface TransferCard {
  id: string
  from: string
  to: string
  status: TransferStatus
  shippedBy: string | null
  receivedBy: string | null
  lines: { book: string; shipped: number; received: number | null }[]
  discrepancies: { id: string; book: string; expected: number; actual: number; isResolved: boolean }[]
  history: HistoryEntry[]
}

export const transferStatus: Record<TransferStatus, { label: string; tone: StatusTone }> = {
  Created: { label: 'Створене', tone: 'draft' },
  Approved: { label: 'Погоджене', tone: 'progress' },
  Shipped: { label: 'В дорозі', tone: 'progress' },
  Received: { label: 'Отримане', tone: 'done' },
}

/** A received transfer with an open discrepancy is shown as a problem, whatever its status. */
export function transferBadge(status: TransferStatus, hasOpenDiscrepancies: boolean) {
  return hasOpenDiscrepancies ? { label: 'Розбіжність', tone: 'problem' as StatusTone } : transferStatus[status]
}
