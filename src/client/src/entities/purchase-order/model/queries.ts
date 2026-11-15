import { useQuery } from '@tanstack/react-query'
import { purchaseOrderApi } from '../api/purchaseOrderApi'
import type { PurchaseOrderStatus } from './types'

export const purchaseOrderKeys = {
  all: ['purchase-orders'] as const,
  list: (filter: { status?: PurchaseOrderStatus; overdue?: boolean }) => ['purchase-orders', 'list', filter] as const,
  card: (id: string) => ['purchase-orders', 'card', id] as const,
}

export function usePurchaseOrders(filter: { status?: PurchaseOrderStatus; overdue?: boolean } = {}) {
  return useQuery({ queryKey: purchaseOrderKeys.list(filter), queryFn: () => purchaseOrderApi.list(filter) })
}

export function usePurchaseOrder(id: string | undefined) {
  return useQuery({ queryKey: purchaseOrderKeys.card(id ?? ''), queryFn: () => purchaseOrderApi.card(id!), enabled: !!id })
}
