import { useQuery } from '@tanstack/react-query'
import { returnApi } from '../api/returnApi'
import { saleApi } from '../api/saleApi'
import { shiftApi } from '../api/shiftApi'

export const saleKeys = {
  all: ['sales'] as const,
  lists: ['sales', 'list'] as const,
  list: (location: string, from: string, cashier: string | null) => ['sales', 'list', location, from, cashier] as const,
  detail: (id: string) => ['sales', 'detail', id] as const,
  pendingReturns: (location: string) => ['sales', 'returns', 'pending', location] as const,
  shift: (location: string) => ['sales', 'shift', location] as const,
}

/** Sales of the store from `from` until now, optionally one cashier's. */
export function useSales(location: string | undefined, from: string, cashier: string | null = null) {
  return useQuery({
    queryKey: saleKeys.list(location ?? '', from, cashier),
    queryFn: () => saleApi.list(location!, { from, to: new Date(Date.now() + 60_000).toISOString(), cashier }),
    enabled: !!location,
  })
}

export function useSale(id: string | undefined) {
  return useQuery({ queryKey: saleKeys.detail(id ?? ''), queryFn: () => saleApi.get(id!), enabled: !!id })
}

export function usePendingReturns(location: string | undefined) {
  return useQuery({
    queryKey: saleKeys.pendingReturns(location ?? ''),
    queryFn: () => returnApi.list(location!, 'Pending'),
    enabled: !!location,
  })
}

export function useOpenShift(location: string | undefined) {
  return useQuery({
    queryKey: saleKeys.shift(location ?? ''),
    queryFn: () => shiftApi.current(location!),
    enabled: !!location,
  })
}
