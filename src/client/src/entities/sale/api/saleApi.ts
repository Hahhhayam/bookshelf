import { http, stub, uah, type Created, type Money } from '@/shared/api'
import { readJson, session, writeJson } from '@/shared/lib'
import type { ItemCondition, SaleDraft, SaleQuote, ShiftReceipt } from '../model/types'

const shiftKey = 'bookshelf.shift-receipts'

export interface QuoteLine {
  book: string
  title: string
  quantity: number
  unitPrice: Money
}

export const saleApi = {
  /** The operation key goes in the Idempotency-Key header: a resend with the same key returns the same sale. */
  complete: (draft: SaleDraft, idempotencyKey: string) =>
    http.post<Created>('sales', draft, { headers: { 'Idempotency-Key': idempotencyKey } }),
  cancel: (id: string) => http.post(`sales/${id}/cancel`),
  confirmPendingPayment: (sale: string, payment: string) => http.post(`sales/${sale}/payments/${payment}/confirm`),

  /**
   * The total before payment. The server has no pricing call (GAP-05), so this is catalog prices without promotions;
   * a promoted book makes the server refuse the payment total, and the till says so.
   */
  quote: (lines: QuoteLine[]): Promise<SaleQuote> =>
    stub('GAP-05', () => {
      const priced = lines.map((line) => ({ ...line, total: uah(line.unitPrice.amount * line.quantity) }))
      return { lines: priced, total: uah(priced.reduce((sum, line) => sum + line.total.amount, 0)), exact: false }
    }),

  /** Receipts of this shift, kept in the tab (GAP-07). */
  shiftReceipts: () => stub('GAP-07', () => readJson<ShiftReceipt[]>(session, shiftKey, [])),
  rememberReceipt: (receipt: ShiftReceipt) =>
    writeJson(session, shiftKey, [receipt, ...readJson<ShiftReceipt[]>(session, shiftKey, [])]),

  createReturn: (sale: string, items: { book: string; quantity: number }[], reason: string, condition: ItemCondition) =>
    http.post<Created>('returns', { sale, items, reason, condition }),
  confirmReturn: (id: string) => http.post(`returns/${id}/confirm`),

  issueGiftCertificate: (number: string, value: Money) => http.post<Created>('gift-certificates', { number, value }),
}
