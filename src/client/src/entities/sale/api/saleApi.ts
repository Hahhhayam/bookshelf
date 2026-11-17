import { http, type Created, type Money } from '@/shared/api'
import type { GiftCertificate, QuoteRequest, SaleDraft, SaleQuote, SaleSummary, SaleView } from '../model/types'

export interface SalePeriod {
  from: string
  to: string
  cashier?: string | null
}

export const saleApi = {
  /** The operation key goes in the Idempotency-Key header: a resend with the same key returns the same sale. */
  complete: (draft: SaleDraft, idempotencyKey: string) =>
    http.post<Created>('sales', draft, { headers: { 'Idempotency-Key': idempotencyKey } }),
  quote: (request: QuoteRequest) => http.post<SaleQuote>('sales/quote', request),
  list: (location: string, period: SalePeriod) =>
    http.get<SaleSummary[]>(`locations/${location}/sales`, { query: { ...period } }),
  get: (id: string) => http.get<SaleView>(`sales/${id}`),
  cancel: (id: string) => http.post(`sales/${id}/cancel`),
  confirmPendingPayment: (sale: string, payment: string) => http.post(`sales/${sale}/payments/${payment}/confirm`),

  issueGiftCertificate: (number: string, value: Money) => http.post<Created>('gift-certificates', { number, value }),
  giftCertificate: (number: string) => http.get<GiftCertificate>(`gift-certificates/${encodeURIComponent(number)}`),
}
