import { useQuery } from '@tanstack/react-query'
import { orderApi } from '../api/orderApi'
import type { OrderStatus } from './types'

export const orderKeys = {
  all: ['orders'] as const,
  list: (location: string, status?: OrderStatus, pickupCode?: string) =>
    ['orders', 'list', location, status ?? 'open', pickupCode ?? ''] as const,
  ofCustomer: (customer: string) => ['orders', 'customer', customer] as const,
  card: (id: string) => ['orders', 'card', id] as const,
  track: (code: string) => ['orders', 'track', code] as const,
}

/** With a pickup code, only that order, in any status (handing an order over by its code). */
export function useOrders(location: string | undefined, status?: OrderStatus, pickupCode?: string) {
  return useQuery({
    queryKey: orderKeys.list(location ?? '', status, pickupCode),
    queryFn: () => orderApi.list(location!, status, pickupCode),
    enabled: !!location,
    refetchInterval: 30_000,
  })
}

export function useOrder(id: string | undefined) {
  return useQuery({ queryKey: orderKeys.card(id ?? ''), queryFn: () => orderApi.card(id!), enabled: !!id })
}

export function useTrackedOrder(code: string | undefined) {
  return useQuery({ queryKey: orderKeys.track(code ?? ''), queryFn: () => orderApi.track(code!), enabled: !!code, retry: false })
}

export function useCustomerOrders(customer: string | null) {
  return useQuery({
    queryKey: orderKeys.ofCustomer(customer ?? ''),
    queryFn: () => orderApi.ofCustomer(customer!),
    enabled: !!customer,
  })
}
