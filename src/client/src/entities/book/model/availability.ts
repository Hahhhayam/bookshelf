import { plural } from '@/shared/lib'
import type { StatusTone } from '@/shared/config/tokens'
import type { Availability, BookHit } from './types'

export type AvailabilityTone = 'ok' | 'elsewhere' | 'none'

/** The status colour each availability is shown in. */
export const availabilityStatusTone: Record<AvailabilityTone, StatusTone> = { ok: 'ready', elsewhere: 'attention', none: 'draft' }

function inStores(count: number) {
  return `Є в ${count} ${plural(count, ['магазині', 'магазинах', 'магазинах'])}`
}

/** One line about where a book can be picked up, from the shopper's store first. */
export function availabilitySummary(availability: readonly Availability[], myStore: string | null): { tone: AvailabilityTone; label: string } {
  const stocked = availability.filter((a) => a.available > 0)
  const mine = myStore ? stocked.find((a) => a.location === myStore) : undefined
  if (mine) return { tone: 'ok', label: `У вашому магазині · ${mine.available} шт.` }
  if (stocked.length === 0) return { tone: 'none', label: 'Немає в наявності' }
  if (myStore) return { tone: 'elsewhere', label: `${inStores(stocked.length)}, не у вашому` }
  return { tone: 'ok', label: inStores(stocked.length) }
}

export function stockedLocations(availability: readonly Availability[]): string[] {
  return [...new Set(availability.filter((a) => a.available > 0).map((a) => a.location))]
}

/**
 * What the search said is free at a store. Search results may lag up to 30 s, so this only warns early;
 * the server checks stock again when the sale is posted.
 */
export function availableAt(hit: BookHit, locationId: string): number | undefined {
  return hit.availability.find((a) => a.location === locationId)?.available
}

export function elsewhere(hit: BookHit, locationId: string): Availability[] {
  return hit.availability.filter((a) => a.location !== locationId && a.available > 0)
}
