import { useQuery } from '@tanstack/react-query'
import { returnApi } from '../api/returnApi'
import { saleApi } from '../api/saleApi'

export const saleKeys = {
  shift: ['sales', 'shift'] as const,
  pendingReturns: ['sales', 'returns', 'pending'] as const,
}

export function useShiftReceipts() {
  return useQuery({ queryKey: saleKeys.shift, queryFn: saleApi.shiftReceipts })
}

export function usePendingReturns() {
  return useQuery({ queryKey: saleKeys.pendingReturns, queryFn: returnApi.pending })
}
