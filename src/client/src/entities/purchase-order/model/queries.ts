import { useQuery } from '@tanstack/react-query'
import { purchaseOrderApi } from '../api/purchaseOrderApi'
import type { PurchaseOrderFilter } from './types'

export const purchaseOrderKeys = {
  all: ['purchase-orders'] as const,
  list: (filter: PurchaseOrderFilter) => ['purchase-orders', 'list', filter] as const,
  card: (id: string) => ['purchase-orders', 'card', id] as const,
}

export const deliveryKeys = {
  all: ['deliveries'] as const,
  list: (location: string) => ['deliveries', 'list', location] as const,
  card: (id: string) => ['deliveries', 'card', id] as const,
}

export const missingBookKeys = {
  all: ['missing-book-requests'] as const,
  list: (location: string) => ['missing-book-requests', location] as const,
}

export function usePurchaseOrders(filter: PurchaseOrderFilter = {}) {
  return useQuery({ queryKey: purchaseOrderKeys.list(filter), queryFn: () => purchaseOrderApi.list(filter) })
}

export function usePurchaseOrder(id: string | undefined) {
  return useQuery({ queryKey: purchaseOrderKeys.card(id ?? ''), queryFn: () => purchaseOrderApi.card(id!), enabled: !!id })
}

export function useDeliveries(location: string | undefined) {
  return useQuery({
    queryKey: deliveryKeys.list(location ?? ''), queryFn: () => purchaseOrderApi.deliveries(location!), enabled: !!location,
  })
}

export function useDelivery(id: string | undefined) {
  return useQuery({ queryKey: deliveryKeys.card(id ?? ''), queryFn: () => purchaseOrderApi.delivery(id!), enabled: !!id })
}

/** Open requests for books the chain does not have, recorded at the location. */
export function useMissingBooks(location: string | undefined) {
  return useQuery({
    queryKey: missingBookKeys.list(location ?? ''), queryFn: () => purchaseOrderApi.missingBooks(location!), enabled: !!location,
  })
}
