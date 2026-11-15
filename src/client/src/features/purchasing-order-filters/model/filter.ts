import { purchaseOrderStatus, type PurchaseOrderStatus, type PurchaseOrderSummary } from '@/entities/purchase-order'

/** «Відкриті» is what the API returns without a status; «усі» joins the open and the closed ones (GAP-38). */
export type StatusFilter = PurchaseOrderStatus | 'open' | 'all'

export interface OrderListFilter {
  status: StatusFilter
  overdue: boolean
  supplier: string | null
  search: string
}

export const defaultOrderFilter: OrderListFilter = { status: 'open', overdue: false, supplier: null, search: '' }

export const statusFilterOptions: { value: StatusFilter; label: string }[] = [
  { value: 'open', label: 'відкриті' },
  { value: 'all', label: 'усі' },
  ...(Object.keys(purchaseOrderStatus) as PurchaseOrderStatus[]).map((status) => ({
    value: status, label: purchaseOrderStatus[status].label.toLowerCase(),
  })),
]

export function statusFilterLabel(status: StatusFilter): string {
  return statusFilterOptions.find((option) => option.value === status)?.label ?? status
}

export function isDefaultFilter(filter: OrderListFilter): boolean {
  return filter.status === 'open' && !filter.overdue && !filter.supplier && !filter.search.trim()
}

/**
 * The supplier and text filters run here, on what the server returned: the API filters only by status and overdue.
 * `haystack` is what the text search looks in (number, supplier name).
 */
export function applyClientFilter(
  rows: readonly PurchaseOrderSummary[], filter: OrderListFilter, haystack: (row: PurchaseOrderSummary) => string,
): PurchaseOrderSummary[] {
  const needle = filter.search.trim().toLowerCase()
  return rows
    .filter((row) => !filter.supplier || row.supplier === filter.supplier)
    .filter((row) => !needle || haystack(row).toLowerCase().includes(needle))
    .toSorted((a, b) => (b.lastChangedAt ?? '').localeCompare(a.lastChangedAt ?? ''))
}
