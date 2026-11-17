import { useQuery } from '@tanstack/react-query'
import { countApi } from '../api/countApi'

export const countKeys = {
  all: ['inventory-counts'] as const,
  list: (location: string) => ['inventory-counts', 'list', location] as const,
  one: (id: string) => ['inventory-counts', 'card', id] as const,
}

export function useCounts(location: string | undefined) {
  return useQuery({ queryKey: countKeys.list(location ?? ''), queryFn: () => countApi.list(location!), enabled: !!location })
}

export function useCount(id: string | undefined) {
  return useQuery({ queryKey: countKeys.one(id ?? ''), queryFn: () => countApi.get(id!), enabled: !!id })
}
