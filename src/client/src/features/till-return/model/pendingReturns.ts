import { stub } from '@/shared/api'
import { local, readJson, writeJson } from '@/shared/lib'
import type { ItemCondition } from '@/entities/sale'

export interface PendingReturn {
  id: string
  sale: string
  book: string
  title: string
  quantity: number
  reason: string
  condition: ItemCondition
  at: string
}

const key = 'bookshelf.pending-returns'

const all = () => readJson<PendingReturn[]>(local, key, [])

/** Returns created in this browser and not yet confirmed: the API cannot list pending returns (GAP-16). */
export const pendingReturns = {
  list: () => stub('GAP-16', all),
  remember: (item: PendingReturn) => writeJson(local, key, [item, ...all().filter((r) => r.id !== item.id)]),
  forget: (id: string) => writeJson(local, key, all().filter((r) => r.id !== id)),
}
