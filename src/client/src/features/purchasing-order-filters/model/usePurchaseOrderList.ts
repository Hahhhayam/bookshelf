import { usePurchaseOrders, type PurchaseOrderFilter } from '@/entities/purchase-order'
import type { StatusFilter } from './filter'

function serverFilter(status: StatusFilter, overdue: boolean): PurchaseOrderFilter {
  if (status === 'all') return { overdue }
  if (status === 'open') return { open: true, overdue }
  return { status, overdue }
}

export function usePurchaseOrderList(status: StatusFilter, overdue: boolean) {
  return usePurchaseOrders(serverFilter(status, overdue))
}
