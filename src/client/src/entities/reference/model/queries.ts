import { useQuery, useQueryClient } from '@tanstack/react-query'
import { referenceApi, store } from '../api/referenceApi'
import type { ReferenceKind } from './types'

export const referenceKeys = {
  list: (kind: ReferenceKind) => ['reference', kind] as const,
}

type Lists = typeof referenceApi.list
type ListData = { [K in ReferenceKind]: Awaited<ReturnType<Lists[K]>> }

/** A reference list (locally remembered until the API can list it: GAP-03, GAP-10, GAP-12). */
export function useReferenceList<K extends ReferenceKind>(kind: K) {
  return useQuery<ListData[K]>({
    queryKey: referenceKeys.list(kind),
    queryFn: () => referenceApi.list[kind]() as Promise<ListData[K]>,
  })
}

export function useRefreshReference() {
  const client = useQueryClient()
  return (kind: ReferenceKind) => client.invalidateQueries({ queryKey: referenceKeys.list(kind) })
}

/** A name for an id from the remembered lists, or a short form of the id when it was never seen here. */
export function referenceName(kind: ReferenceKind, id: string | null | undefined): string {
  if (!id) return '—'
  return store[kind].find(id)?.name ?? `#${id.slice(0, 8)}`
}
