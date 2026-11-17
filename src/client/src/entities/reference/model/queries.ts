import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { referenceApi } from '../api/referenceApi'
import type { ReferenceKind } from './types'

export const referenceKeys = {
  list: (kind: ReferenceKind) => ['reference', kind] as const,
  logins: ['reference', 'logins'] as const,
}

type Lists = typeof referenceApi.list
type ListData = { [K in ReferenceKind]: Awaited<ReturnType<Lists[K]>> }

const staleTime = 5 * 60_000

function onlyActive<T>(items: T[]): T[] {
  return items.filter((item) => (item as { active?: boolean }).active !== false)
}

/** A reference list from the server. `active` leaves out deactivated items, for pickers of new documents. */
export function useReferenceList<K extends ReferenceKind>(kind: K, options: { active?: boolean; enabled?: boolean } = {}) {
  return useQuery<ListData[K]>({
    queryKey: referenceKeys.list(kind),
    queryFn: () => referenceApi.list[kind]() as Promise<ListData[K]>,
    select: options.active ? (onlyActive as (items: ListData[K]) => ListData[K]) : undefined,
    enabled: options.enabled,
    staleTime,
  })
}

export function useRefreshReference() {
  const client = useQueryClient()
  return (kind: ReferenceKind) => client.invalidateQueries({ queryKey: referenceKeys.list(kind) })
}

/** A short form of an id, while its list loads. */
export const shortName = (id: string) => `#${id.slice(0, 8)}`

/**
 * Names ids of one reference list; an id not (yet) in the list gets a short form. `enabled: false` skips a list the
 * viewer has no right to read.
 */
export function useReferenceNames(kind: ReferenceKind, options: { enabled?: boolean } = {}): (id: string | null | undefined) => string {
  const { data } = useReferenceList(kind, options)
  return useCallback(
    (id) => (id ? (data as { id: string; name: string }[] | undefined)?.find((item) => item.id === id)?.name ?? shortName(id) : '—'),
    [data],
  )
}

/** Logins of all users, which any employee may read to see who changed a document. */
export function useUserLogins() {
  return useQuery({ queryKey: referenceKeys.logins, queryFn: referenceApi.logins, staleTime })
}
