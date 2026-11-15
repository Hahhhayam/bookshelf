import { useMemo } from 'react'
import { referenceName, useReferenceList, type Location } from '@/entities/reference'
import { useViewer, type ViewerLocation } from '@/entities/viewer'

export interface KnownLocation extends Location {
  /** The signed-in user has access to it (it came from /auth/me). */
  own: boolean
}

function merge(own: readonly ViewerLocation[], remembered: readonly Location[]): KnownLocation[] {
  const byId = new Map<string, KnownLocation>()
  for (const location of remembered) byId.set(location.id, { ...location, own: false })
  for (const location of own) {
    const seen = byId.get(location.id)
    byId.set(location.id, seen
      ? { ...seen, own: true }
      : { ...location, address: '', active: true, own: true })
  }
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, 'uk'))
}

/**
 * Every location this browser knows: the user's own (from /auth/me) and those remembered here. The API cannot list
 * locations (API_GAPS.md, GAP-03), so this is the best list the administration screens can offer.
 */
export function useKnownLocations() {
  const viewer = useViewer()
  const remembered = useReferenceList('locations')
  const list = useMemo(
    () => merge(viewer.data?.locations ?? [], remembered.data ?? []),
    [viewer.data, remembered.data],
  )
  const nameOf = (id: string) => list.find((location) => location.id === id)?.name ?? referenceName('locations', id)
  return { list, query: remembered, nameOf }
}
