import type { FulfilmentKind, OrderStatus, OrderType } from '@/entities/order'

/** The label of the button that moves an order out of each status (the target comes from `nextOrderStatus`). */
export const orderStepLabel: Record<OrderStatus, string | null> = {
  New: 'Підтвердити',
  Confirmed: 'Почати комплектування',
  Picking: 'Готове',
  Ready: 'Видати клієнту',
  Issued: null,
  Cancelled: null,
}

/** The store's norm per status, in minutes: a new order is confirmed within 30 minutes, a ready one issued in 3 days. */
export const waitingNorm: Record<OrderStatus, number | null> = {
  New: 30,
  Confirmed: 60,
  Picking: 60,
  Ready: 3 * 24 * 60,
  Issued: null,
  Cancelled: null,
}

export const waitingNormText = 'Норма: нове — підтвердити за 30 хв, готове — видати за 3 дні'

export function isWaitingTooLong(status: OrderStatus, waitedMinutes: number): boolean {
  const norm = waitingNorm[status]
  return norm !== null && waitedMinutes > norm
}

/** «12 хв», «1 год 05 хв», «2 дн». */
export function formatWaited(minutes: number): string {
  if (minutes < 60) return `${Math.max(minutes, 0)} хв`
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} год ${String(minutes % 60).padStart(2, '0')} хв`
  return `${Math.floor(minutes / (24 * 60))} дн`
}

export const orderTypeLabel: Record<OrderType, string> = { Retail: 'Роздріб', B2B: 'B2B' }

export const fulfilmentLabel: Record<FulfilmentKind, string> = { Pickup: 'Самовивіз', Delivery: 'Доставка' }
