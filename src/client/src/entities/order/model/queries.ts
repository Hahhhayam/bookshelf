import { useQuery } from '@tanstack/react-query'
import { orderApi } from '../api/orderApi'
import type { OrderStatus } from './types'

export const orderKeys = {
  all: ['orders'] as const,
  list: (location: string, status?: OrderStatus) => ['orders', 'list', location, status ?? 'open'] as const,
  card: (id: string) => ['orders', 'card', id] as const,
  track: (code: string) => ['orders', 'track', code] as const,
}

export function useOrders(location: string | undefined, status?: OrderStatus) {
  return useQuery({
    queryKey: orderKeys.list(location ?? '', status),
    queryFn: () => orderApi.list(location!, status),
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
