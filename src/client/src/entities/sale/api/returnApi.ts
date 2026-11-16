import { http, stub, type Created } from '@/shared/api'
import { local, readJson, writeJson } from '@/shared/lib'
import type { ItemCondition, PendingReturn } from '../model/types'

const pendingKey = 'bookshelf.pending-returns'

const pending = () => readJson<PendingReturn[]>(local, pendingKey, [])

export const returnApi = {
  create: (sale: string, items: { book: string; quantity: number }[], reason: string, condition: ItemCondition) =>
    http.post<Created>('returns', { sale, items, reason, condition }),
  confirm: (id: string) => http.post(`returns/${id}/confirm`),

  /** Returns created in this browser and not yet confirmed: the API cannot list pending returns (GAP-16). */
  pending: () => stub('GAP-16', pending),
  rememberPending: (item: PendingReturn) =>
    writeJson(local, pendingKey, [item, ...pending().filter((r) => r.id !== item.id)]),
  forgetPending: (id: string) => writeJson(local, pendingKey, pending().filter((r) => r.id !== id)),
}
