import type { HistoryEntry, Money } from '@/shared/api'
import type { StatusTone } from '@/shared/config/tokens'

export type OrderStatus = 'New' | 'Confirmed' | 'Picking' | 'Ready' | 'Issued' | 'Cancelled'
export type OrderType = 'Retail' | 'B2B'
export type FulfilmentKind = 'Pickup' | 'Delivery'

export interface OrderSummary {
  id: string
  customer: string
  type: OrderType
  status: OrderStatus
  lastChangedAt: string | null
  lastChangedBy: string | null
}

export interface OrderCard {
  id: string
  customer: string
  type: OrderType
  status: OrderStatus
  stockLocation: string
  pickupCode: string
  fulfilment: { kind: FulfilmentKind; pickupLocation: string | null; deliveryAddress: string | null }
  total: Money
  lines: { book: string; quantity: number; unitPrice: Money }[]
  history: HistoryEntry[]
}

/** The order as its pickup code shows it to anyone: contents and progress, never personal or staff data. */
export interface TrackedOrder {
  id: string
  status: OrderStatus
  kind: FulfilmentKind
  /** The pickup store; null for delivery. */
  store: string | null
  total: Money
  lines: { book: string; quantity: number; unitPrice: Money }[]
  history: { to: OrderStatus; at: string }[]
}

export interface PlacedOrder {
  id: string
  pickupCode: string
}

export const orderStatus: Record<OrderStatus, { label: string; tone: StatusTone }> = {
  New: { label: 'Нове', tone: 'draft' },
  Confirmed: { label: 'Підтверджене', tone: 'progress' },
  Picking: { label: 'Комплектується', tone: 'progress' },
  Ready: { label: 'Готове', tone: 'ready' },
  Issued: { label: 'Видане', tone: 'done' },
  Cancelled: { label: 'Скасоване', tone: 'problem' },
}

/** The allowed route of an order (FR-08); the server enforces it, the client only offers these buttons. */
export const nextOrderStatus: Record<OrderStatus, OrderStatus | null> = {
  New: 'Confirmed', Confirmed: 'Picking', Picking: 'Ready', Ready: 'Issued', Issued: null, Cancelled: null,
}

export const cancellable = (status: OrderStatus) => status !== 'Issued' && status !== 'Cancelled'

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

export function isWaitingTooLong(status: OrderStatus, waitedMinutes: number): boolean {
  const norm = waitingNorm[status]
  return norm !== null && waitedMinutes > norm
}

export const orderTypeLabel: Record<OrderType, string> = { Retail: 'Роздріб', B2B: 'B2B' }

export const fulfilmentLabel: Record<FulfilmentKind, string> = { Pickup: 'Самовивіз', Delivery: 'Доставка' }
