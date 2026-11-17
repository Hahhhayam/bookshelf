import { useBookCards, type Availability } from '@/entities/book'
import type { CartLine } from '@/entities/cart'
import { onlyStores, useStores } from '@/entities/store'

/** A store that has at least one cart book, and the titles it cannot supply in the wanted quantity. */
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

/** Live availability of every cart book at the stores, and which stores can supply the whole cart. */
export function useCartAvailability(lines: readonly CartLine[]) {
  const cards = useBookCards(lines.map((line) => line.book))
  const stores = useStores()
  const availabilityOf = (book: string) => onlyStores(cards.cardOf(book)?.availability ?? [], stores.data)
  const byBook = new Map(lines.map((line) => [line.book, availabilityOf(line.book)]))
  return {
    isPending: cards.isPending || stores.isPending,
    error: cards.error ?? stores.error,
    refetch: () => { cards.refetch(); void stores.refetch() },
    stores: coverage(lines, byBook),
    availabilityOf,
  }
}
