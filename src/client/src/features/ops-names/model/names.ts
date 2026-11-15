import { referenceName, useReferenceList } from '@/entities/reference'
import { useViewer, type ViewerLocation } from '@/entities/viewer'
import { shortId } from '@/shared/lib'

/** A location name: the user's own locations first, then those remembered in this browser (GAP-03). */
export function useLocationName(): (id: string | null | undefined) => string {
  const own = useViewer().data?.locations ?? []
  return (id) => (id ? own.find((location) => location.id === id)?.name ?? referenceName('locations', id) : '—')
}

/** Every location this browser knows: the user's own and the remembered ones (GAP-03), without duplicates. */
export function useKnownLocations(): Pick<ViewerLocation, 'id' | 'name'>[] {
  const own = useViewer().data?.locations ?? []
  const remembered = useReferenceList('locations').data ?? []
  const known = new Map<string, string>()
  remembered.filter((location) => location.active).forEach((location) => known.set(location.id, location.name))
  own.forEach((location) => known.set(location.id, location.name))
  return [...known].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name, 'uk'))
}

/** A user's login when this browser has seen it, else a short id: the API has no user names (GAP-04). */
export function userName(id: string | null | undefined): string {
  if (!id) return '—'
  const name = referenceName('users', id)
  return name.startsWith('#') ? `користувач ${shortId(id)}` : name
}
