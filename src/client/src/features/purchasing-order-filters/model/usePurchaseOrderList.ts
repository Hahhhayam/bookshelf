import { useQuery } from '@tanstack/react-query'
import { stub } from '@/shared/api'
import { purchaseOrderApi, purchaseOrderKeys, type PurchaseOrderSummary } from '@/entities/purchase-order'
import type { StatusFilter } from './filter'

/** The API lists either the open orders or one status; «усі» needs the open ones plus each closed status. */
async function listAll(overdue: boolean): Promise<PurchaseOrderSummary[]> {
  const parts = await Promise.all([
    purchaseOrderApi.list({ overdue }),
    purchaseOrderApi.list({ status: 'Received', overdue }),
    purchaseOrderApi.list({ status: 'Cancelled', overdue }),
  ])
  return stub('GAP-38', parts.flat())
}

/** Keys stay under `purchaseOrderKeys.all`, so a mutation's invalidation refreshes every variant. */
export function usePurchaseOrderList(status: StatusFilter, overdue: boolean) {
  return useQuery({
    queryKey: status === 'all'
      ? [...purchaseOrderKeys.all, 'list-all', { overdue }]
      : purchaseOrderKeys.list({ status: status === 'open' ? undefined : status, overdue }),
    queryFn: () => status === 'all'
      ? listAll(overdue)
      : purchaseOrderApi.list({ status: status === 'open' ? undefined : status, overdue }),
  })
}
