import { purchaseOrderStatus, type PurchaseOrderStatus, type PurchaseOrderSummary } from '@/entities/purchase-order'

/** «Відкриті» is what the API returns without a status; «усі» joins the open and the closed ones (GAP-38). */
export type StatusFilter = PurchaseOrderStatus | 'open' | 'all'

export interface OrderListFilter {
  status: StatusFilter
  overdue: boolean
  supplier: string | null
}

export const defaultOrderFilter: OrderListFilter = { status: 'open', overdue: false, supplier: null }

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
  return filter.status === 'open' && !filter.overdue && !filter.supplier
}

/** The supplier filter runs here, on what the server returned: the API filters only by status and overdue. */
export function applyClientFilter(rows: readonly PurchaseOrderSummary[], filter: OrderListFilter): PurchaseOrderSummary[] {
  return rows
    .filter((row) => !filter.supplier || row.supplier === filter.supplier)
    .toSorted((a, b) => (b.lastChangedAt ?? '').localeCompare(a.lastChangedAt ?? ''))
}
