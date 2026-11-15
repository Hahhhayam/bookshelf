import type { Availability } from '@/entities/book'

export type AvailabilityTone = 'ok' | 'elsewhere' | 'none'

const storeRules = new Intl.PluralRules('uk-UA')

function inStores(count: number) {
  return `Є в ${count} ${storeRules.select(count) === 'one' ? 'магазині' : 'магазинах'}`
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
