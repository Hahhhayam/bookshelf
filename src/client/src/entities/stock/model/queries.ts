import { useQuery } from '@tanstack/react-query'
import { stockApi } from '../api/stockApi'

export const stockKeys = {
  location: (location: string, filter: { book?: string; belowMinimum?: boolean } = {}) =>
    ['stock', location, filter] as const,
}

export function useLocationStock(location: string | undefined, filter: { book?: string; belowMinimum?: boolean } = {}) {
  return useQuery({
    queryKey: stockKeys.location(location ?? '', filter),
    queryFn: () => stockApi.atLocation(location!, filter),
    enabled: !!location,
  })
}
