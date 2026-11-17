import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { bookApi } from '../api/bookApi'
import type { BookSearch } from './types'

export const bookKeys = {
  all: ['books'] as const,
  search: (query: BookSearch) => ['books', 'search', query] as const,
  card: (id: string) => ['books', 'card', id] as const,
  prices: (id: string) => ['books', 'prices', id] as const,
  byIds: (ids: readonly string[]) => ['books', 'by-ids', ids] as const,
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

/** One scan: an ISBN goes to the ISBN filter, anything else to text search, where an exact barcode wins. */
export function useFindBook() {
  return useMutation({ mutationFn: (code: string) => bookApi.findByCode(code) })
}

/**
 * Several books by id in one batch lookup (title, price, availability). `staleTime` lets lists that show only titles
 * skip refetching, while live availability keeps the default.
 */
export function useBookCards(ids: readonly string[], staleTime = 0) {
  const unique = [...new Set(ids)].sort()
  const query = useQuery({
    queryKey: bookKeys.byIds(unique),
    queryFn: () => bookApi.byIds(unique),
    enabled: unique.length > 0,
    staleTime,
    placeholderData: keepPreviousData,
  })
  const hits = new Map((query.data ?? []).map((hit) => [hit.id, hit]))
  return {
    isPending: unique.length > 0 && query.isPending,
    error: query.error,
    refetch: () => void query.refetch(),
    cardOf: (id: string) => hits.get(id),
  }
}

/** Titles for lists that carry only book ids (orders, transfers, reports). */
export function useBookTitles(ids: readonly string[]): (id: string) => string {
  const { cardOf } = useBookCards(ids, 5 * 60_000)
  return (id) => cardOf(id)?.title ?? '…'
}
