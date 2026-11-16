import { useQuery } from '@tanstack/react-query'
import { countApi } from '../api/countApi'

export const countKeys = {
  all: ['inventory-counts'] as const,
  one: (id: string) => ['inventory-counts', id] as const,
}

/** Counts started in this browser: the API cannot read counts back (GAP-08). */
export function useCounts() {
  return useQuery({ queryKey: countKeys.all, queryFn: countApi.list })
}

export function useCount(id: string | undefined) {
  return useQuery({ queryKey: countKeys.one(id ?? ''), queryFn: () => countApi.get(id!), enabled: !!id })
}
