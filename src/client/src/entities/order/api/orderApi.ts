import { http } from '@/shared/api'
import type { FulfilmentKind, OrderCard, OrderStatus, OrderSummary, OrderType, PlacedOrder, TrackedOrder } from '../model/types'

export interface PlaceOrder {
  customer: string
  type: OrderType
  stockLocation: string
  fulfilment: { kind: FulfilmentKind; pickupLocation: string | null; deliveryAddress: string | null }
}

export const orderApi = {
  list: (location: string, status?: OrderStatus) => http.get<OrderSummary[]>(`locations/${location}/orders`, { query: { status } }),
  card: (id: string) => http.get<OrderCard>(`orders/${id}`),
  track: (code: string) => http.get<TrackedOrder>(`orders/track/${encodeURIComponent(code)}`),
  changeStatus: (id: string, status: OrderStatus) => http.post(`orders/${id}/status`, { status }),
  addToCart: (customer: string, book: string, quantity: number) => http.post(`customers/${customer}/cart/items`, { book, quantity }),
  place: (order: PlaceOrder) => http.post<PlacedOrder>('orders', order),
}
