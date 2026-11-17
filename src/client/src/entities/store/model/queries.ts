import { useQuery } from '@tanstack/react-query'
import { storeApi } from '../api/storeApi'
import type { Store } from './types'

export const storeKeys = {
  all: ['stores'] as const,
}

export function useStores() {
  return useQuery({ queryKey: storeKeys.all, queryFn: storeApi.list, staleTime: 10 * 60_000 })
}

/** A store's name, or a short form of the id while the list loads or for a location that is not a store. */
export function storeName(stores: readonly Store[] | undefined, id: string | null | undefined): string {
  if (!id) return '—'
  return stores?.find((store) => store.id === id)?.name ?? `Магазин #${id.slice(0, 8)}`
}

/** Availability rows at stores only, since a customer cannot collect at a warehouse; all rows while the list loads. */
export function onlyStores<T extends { location: string }>(rows: readonly T[], stores: readonly Store[] | undefined): T[] {
  return stores ? rows.filter((row) => stores.some((store) => store.id === row.location)) : [...rows]
}
