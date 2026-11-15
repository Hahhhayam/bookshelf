import { useQuery } from '@tanstack/react-query'
import { saleApi } from '../api/saleApi'

export const saleKeys = {
  shift: ['sales', 'shift'] as const,
}

export function useShiftReceipts() {
  return useQuery({ queryKey: saleKeys.shift, queryFn: saleApi.shiftReceipts })
}
