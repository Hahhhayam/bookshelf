import { http, type Created, type Money } from '@/shared/api'
import type {
  GoodsReceiptCard, GoodsReceiptSummary, MissingBookRequest, PurchaseOrderCard, PurchaseOrderFilter, PurchaseOrderSummary,
} from '../model/types'

export interface PurchaseOrderLine {
  book: string
  quantity: number
  purchasePrice: Money
}

export const purchaseOrderApi = {
  list: (filter: PurchaseOrderFilter = {}) => http.get<PurchaseOrderSummary[]>('purchase-orders', { query: { ...filter } }),
  card: (id: string) => http.get<PurchaseOrderCard>(`purchase-orders/${id}`),
  create: (supplier: string, expectedDate: string, lines: PurchaseOrderLine[]) =>
    http.post<Created>('purchase-orders', { supplier, expectedDate, lines }),
  send: (id: string) => http.post(`purchase-orders/${id}/send`),
  cancel: (id: string) => http.post(`purchase-orders/${id}/cancel`),
  /** `idempotencyKey` stays the same across retries of one delivery, so it is received once. */
  receiveDelivery: (
    location: string, purchaseOrder: string | null, supplier: string | null, received: { book: string; quantity: number }[],
    idempotencyKey: string,
  ) => http.post<Created>('deliveries', { location, purchaseOrder, supplier, received }, { headers: { 'Idempotency-Key': idempotencyKey } }),
  deliveries: (location: string) => http.get<GoodsReceiptSummary[]>('deliveries', { query: { location } }),
  delivery: (id: string) => http.get<GoodsReceiptCard>(`deliveries/${id}`),
  recordMissingBook: (title: string, author: string | null, location: string, customer: string | null) =>
    http.post<Created>('missing-book-requests', { title, author, location, customer }),
  missingBooks: (location: string) => http.get<MissingBookRequest[]>('missing-book-requests', { query: { location } }),
}
