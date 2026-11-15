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

export interface TrackedOrder {
  status: OrderStatus
  kind: FulfilmentKind
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
