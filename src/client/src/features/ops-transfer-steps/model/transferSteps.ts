import type { TransferStatus } from '@/entities/transfer'

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
