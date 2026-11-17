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

export interface TransferDiscrepancy {
  id: string
  book: string
  expected: number
  actual: number
  isResolved: boolean
  reason: string | null
  resolvedBy: string | null
  resolvedAt: string | null
}

export interface TransferCard {
  id: string
  from: string
  to: string
  status: TransferStatus
  shippedBy: string | null
  receivedBy: string | null
  lines: { book: string; shipped: number; received: number | null }[]
  discrepancies: TransferDiscrepancy[]
  history: HistoryEntry[]
}

export const transferStatus: Record<TransferStatus, { label: string; tone: StatusTone }> = {
  Created: { label: 'Створене', tone: 'draft' },
  Approved: { label: 'Погоджене', tone: 'progress' },
  Shipped: { label: 'В дорозі', tone: 'progress' },
  Received: { label: 'Отримане', tone: 'done' },
}

/** Reasons offered when closing a discrepancy (Document artboard); any other reason can be typed. */
export const discrepancyReasons = ['Недостача від складу', 'Пошкоджено при доставці']

/** A received transfer with an open discrepancy is shown as a problem, whatever its status. */
export function transferBadge(status: TransferStatus, hasOpenDiscrepancies: boolean) {
  return hasOpenDiscrepancies ? { label: 'Розбіжність', tone: 'problem' as StatusTone } : transferStatus[status]
}

export type TransferSide = 'sender' | 'receiver' | 'none'
export type TransferStepKind = 'approve' | 'ship' | 'receive'

export interface TransferStep {
  kind: TransferStepKind
  side: Exclude<TransferSide, 'none'>
  label: string
  confirmTitle: string
  confirmText: string
  /** Shown to the other side of the route while the step is not theirs. */
  waiting: string
}

/** The sender approves and ships, the receiver enters what arrived (UI_Design 6.4). */
export const transferStep: Record<TransferStatus, TransferStep | null> = {
  Created: {
    kind: 'approve', side: 'sender', label: 'Погодити',
    confirmTitle: 'Погодити переміщення?',
    confirmText: 'Після погодження склад-відправник комплектує книжки до відправки.',
    waiting: 'Чекає погодження відправником',
  },
  Approved: {
    kind: 'ship', side: 'sender', label: 'Відправити',
    confirmTitle: 'Відправити переміщення?',
    confirmText: 'Книжки буде списано із залишків відправника і позначено «В дорозі». Скасувати відправку не можна.',
    waiting: 'Чекає відправки',
  },
  Shipped: {
    kind: 'receive', side: 'receiver', label: 'Прийняти',
    confirmTitle: 'Прийняти переміщення?',
    confirmText: 'Залишки отримувача зміняться на фактично прийняті кількості.',
    waiting: 'В дорозі — чекає приймання отримувачем',
  },
  Received: null,
}

export function transferSide(route: { from: string; to: string }, location: string | undefined): TransferSide {
  if (location === route.from) return 'sender'
  if (location === route.to) return 'receiver'
  return 'none'
}
