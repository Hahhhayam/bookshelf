import type { OrderStatus, TrackedOrder } from '@/entities/order'

export type StepState = 'done' | 'current' | 'next'

export interface TrackStep {
  status: OrderStatus
  at: string | null
  state: StepState
}

const route: OrderStatus[] = ['New', 'Confirmed', 'Picking', 'Ready', 'Issued']

/** What the customer reads under each step; staff names are never shown here. */
export const stepText: Record<OrderStatus, string> = {
  New: 'Ми отримали ваше замовлення',
  Confirmed: 'Книжки зарезервовано для вас',
  Picking: 'Збираємо книжки',
  Ready: 'Можна забирати',
  Issued: 'Замовлення видано',
  Cancelled: 'Замовлення скасовано',
}

/** The changes that happened, then the rest of the usual route still ahead (none after a cancellation). */
export function trackSteps(order: TrackedOrder): TrackStep[] {
  const happened = order.history.map((h) => ({ status: h.to, at: h.at as string | null }))
  if (!happened.some((h) => h.status === 'New')) happened.unshift({ status: 'New', at: null })
  const steps: TrackStep[] = happened.map((h, i) => ({ ...h, state: i === happened.length - 1 ? 'current' : 'done' }))
  if (order.status === 'Cancelled') return steps
  const ahead = route.slice(route.indexOf(order.status) + 1)
  return [...steps, ...ahead.map((status) => ({ status, at: null, state: 'next' as const }))]
}
