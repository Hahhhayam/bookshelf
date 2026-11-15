import { http, type Created, type Money } from '@/shared/api'
import type { PurchaseOrderCard, PurchaseOrderStatus, PurchaseOrderSummary } from '../model/types'

export interface PurchaseOrderLine {
  book: string
  quantity: number
  purchasePrice: Money
}

export const purchaseOrderApi = {
  list: (filter: { status?: PurchaseOrderStatus; overdue?: boolean } = {}) =>
    http.get<PurchaseOrderSummary[]>('purchase-orders', { query: filter }),
  card: (id: string) => http.get<PurchaseOrderCard>(`purchase-orders/${id}`),
  create: (supplier: string, expectedDate: string, lines: PurchaseOrderLine[]) =>
    http.post<Created>('purchase-orders', { supplier, expectedDate, lines }),
  send: (id: string) => http.post(`purchase-orders/${id}/send`),
  receiveDelivery: (location: string, purchaseOrder: string | null, supplier: string | null, received: { book: string; quantity: number }[]) =>
    http.post<Created>('deliveries', { location, purchaseOrder, supplier, received }),
  recordMissingBook: (title: string, author: string | null, location: string, customer: string | null) =>
    http.post<Created>('missing-book-requests', { title, author, location, customer }),
}
