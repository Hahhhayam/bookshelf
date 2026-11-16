import { useBookCards, type Availability } from '@/entities/book'
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
 * Live availability of every cart book and the stores that can supply them. Stores are only the locations that
 * appear here, since the API has no public store list (GAP-14).
 */
export function useCartAvailability(lines: readonly CartLine[]) {
  const cards = useBookCards(lines.map((line) => line.book))
  const availabilityOf = (book: string) => cards.cardOf(book)?.availability ?? []
  const byBook = new Map(lines.map((line) => [line.book, availabilityOf(line.book)]))
  return { isPending: cards.isPending, error: cards.error, refetch: cards.refetch, stores: coverage(lines, byBook), availabilityOf }
}
