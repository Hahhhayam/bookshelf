import type { Availability, BookHit } from '@/entities/book'

/**
 * What the search said is free at the till's store. Search results may lag up to 30 s, so this only warns early;
 * the server checks stock again when the sale is posted.
 */
export function availableAt(hit: BookHit, locationId: string): number | undefined {
  return hit.availability.find((a) => a.location === locationId)?.available
}

export function elsewhere(hit: BookHit, locationId: string): Availability[] {
  return hit.availability.filter((a) => a.location !== locationId && a.available > 0)
}
