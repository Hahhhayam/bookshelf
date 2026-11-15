import { useQueries } from '@tanstack/react-query'
import { bookApi, bookKeys, type Availability } from '@/entities/book'
import type { CartLine } from '@/entities/cart'

/** A location that has at least one cart book, and the titles it cannot supply in the wanted quantity. */
export interface StoreCoverage {
  location: string
  missing: string[]
}

function stockAt(availability: readonly Availability[], location: string) {
  return availability.find((a) => a.location === location)?.available ?? 0
}

function coverage(lines: readonly CartLine[], byBook: Map<string, Availability[]>): StoreCoverage[] {
  const locations = [...new Set([...byBook.values()].flat().filter((a) => a.available > 0).map((a) => a.location))]
  return locations
    .map((location) => ({
      location,
      missing: lines.filter((l) => stockAt(byBook.get(l.book) ?? [], location) < l.quantity).map((l) => l.title),
    }))
    .sort((a, b) => a.missing.length - b.missing.length)
}

/**
 * Live availability of every cart book, one cached card request each (GAP-13). Stores are only the locations that
 * appear here, since the API has no public store list (GAP-14).
 */
export function useCartAvailability(lines: readonly CartLine[]) {
  const results = useQueries({
    queries: lines.map((line) => ({ queryKey: bookKeys.card(line.book), queryFn: () => bookApi.card(line.book) })),
  })
  const byBook = new Map(lines.map((line, i) => [line.book, results[i]?.data?.availability ?? []]))
  return {
    isPending: results.some((r) => r.isPending),
    error: results.find((r) => r.isError)?.error ?? null,
    refetch: () => results.forEach((r) => void r.refetch()),
    stores: coverage(lines, byBook),
    availabilityOf: (book: string) => byBook.get(book) ?? [],
  }
}
