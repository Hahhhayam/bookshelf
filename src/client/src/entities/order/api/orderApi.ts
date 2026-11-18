import { http } from '@/shared/api'
import type { CustomerOrder, FulfilmentKind, OrderCard, OrderStatus, OrderSummary, OrderType, PlacedOrder, TrackedOrder } from '../model/types'

export interface PlaceOrder {
  customer: string
  type: OrderType
  stockLocation: string
  fulfilment: { kind: FulfilmentKind; pickupLocation: string | null; deliveryAddress: string | null }
}

export const orderApi = {
  list: (location: string, status?: OrderStatus, pickupCode?: string) =>
    http.get<OrderSummary[]>(`locations/${location}/orders`, { query: { status, pickupCode } }),
  ofCustomer: (customer: string) => http.get<CustomerOrder[]>(`customers/${customer}/orders`),
  card: (id: string) => http.get<OrderCard>(`orders/${id}`),
  track: (code: string) => http.get<TrackedOrder>(`orders/track/${encodeURIComponent(code)}`),
  changeStatus: (id: string, status: OrderStatus) => http.post(`orders/${id}/status`, { status }),
  place: (order: PlaceOrder) => http.post<PlacedOrder>('orders', order),
}
