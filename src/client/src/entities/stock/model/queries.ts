import { useQuery } from '@tanstack/react-query'
import { stockApi } from '../api/stockApi'

type StockFilter = { book?: string; belowMinimum?: boolean }

export const stockKeys = {
  all: ['stock'] as const,
  /** Every cached stock list of the location, whatever its filter. */
  atLocation: (location: string) => ['stock', location] as const,
  list: (location: string, filter: StockFilter = {}) => ['stock', location, filter] as const,
}

export function useLocationStock(location: string | undefined, filter: StockFilter = {}) {
  return useQuery({
    queryKey: stockKeys.list(location ?? '', filter),
    queryFn: () => stockApi.atLocation(location!, filter),
    enabled: !!location,
  })
}
