import { http, type Created } from '@/shared/api'
import type { ItemCondition, ReturnStatus, ReturnView } from '../model/types'

export interface ReturnDraft {
  sale: string
  items: { book: string; quantity: number }[]
  reason: string
  condition: ItemCondition
}

export const returnApi = {
  /** Like a sale, a return carries its operation key: a resend with the same key returns the same return. */
  create: (draft: ReturnDraft, idempotencyKey: string) =>
    http.post<Created>('returns', draft, { headers: { 'Idempotency-Key': idempotencyKey } }),
  confirm: (id: string) => http.post(`returns/${id}/confirm`),
  list: (location: string, status: ReturnStatus) =>
    http.get<ReturnView[]>(`locations/${location}/returns`, { query: { status } }),
}
