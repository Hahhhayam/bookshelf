import { useQueries, useQuery } from '@tanstack/react-query'
import { bookApi } from '../api/bookApi'
import type { BookSearch } from './types'

export const bookKeys = {
  all: ['books'] as const,
  search: (query: BookSearch) => ['books', 'search', query] as const,
  card: (id: string) => ['books', 'card', id] as const,
  prices: (id: string) => ['books', 'prices', id] as const,
}

export function useBookSearch(query: BookSearch, enabled = true) {
  return useQuery({ queryKey: bookKeys.search(query), queryFn: () => bookApi.search(query), enabled })
}

export function useBookCard(id: string | undefined) {
  return useQuery({ queryKey: bookKeys.card(id ?? ''), queryFn: () => bookApi.card(id!), enabled: !!id })
}

export function usePriceHistory(id: string | undefined) {
  return useQuery({ queryKey: bookKeys.prices(id ?? ''), queryFn: () => bookApi.prices(id!), enabled: !!id })
}

/**
 * Titles for lists that carry only book ids (orders, transfers, reports). The API has no batch lookup, so each title
 * is one cached card request (API_GAPS.md, GAP-13).
 */
export function useBookTitles(ids: readonly string[]): (id: string) => string {
  const unique = [...new Set(ids)]
  const results = useQueries({
    queries: unique.map((id) => ({ queryKey: bookKeys.card(id), queryFn: () => bookApi.card(id), staleTime: 5 * 60_000 })),
  })
  const titles = new Map(unique.map((id, i) => [id, results[i]?.data?.title]))
  return (id) => titles.get(id) ?? '…'
}
