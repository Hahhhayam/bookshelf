import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
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

/** One scan: an ISBN goes to the ISBN filter, anything else to text search (no barcode filter yet, GAP-06). */
export function useFindBook() {
  return useMutation({ mutationFn: (code: string) => bookApi.findByCode(code) })
}

/**
 * Cards of several books. The API has no batch lookup, so each is one cached card request (API_GAPS.md, GAP-13);
 * `staleTime` lets lists that show only titles skip refetching, while live availability keeps the default.
 */
export function useBookCards(ids: readonly string[], staleTime = 0) {
  const unique = [...new Set(ids)]
  const results = useQueries({
    queries: unique.map((id) => ({ queryKey: bookKeys.card(id), queryFn: () => bookApi.card(id), staleTime })),
  })
  const cards = new Map(unique.map((id, i) => [id, results[i]?.data]))
  return {
    isPending: results.some((r) => r.isPending),
    error: results.find((r) => r.isError)?.error ?? null,
    refetch: () => results.forEach((r) => void r.refetch()),
    cardOf: (id: string) => cards.get(id),
  }
}

/** Titles for lists that carry only book ids (orders, transfers, reports). */
export function useBookTitles(ids: readonly string[]): (id: string) => string {
  const { cardOf } = useBookCards(ids, 5 * 60_000)
  return (id) => cardOf(id)?.title ?? '…'
}
