import { useMemo } from 'react'
import { initials, shortId } from '@/shared/lib'
import { referenceName, useReferenceList } from './queries'
import type { Location } from './types'

/** A location the signed-in user has access to, as /auth/me gives it (`ViewerLocation`, entities/viewer). */
export type OwnLocation = Pick<Location, 'id' | 'name' | 'type'>

/** The signed-in user, as /auth/me gives it (`Viewer`, entities/viewer). */
export interface Self {
  id: string
  login: string
}

export interface KnownLocation extends Location {
  /** The signed-in user has access to it (it came from /auth/me). */
  own: boolean
}

/** A location name: the user's own locations first, then those remembered in this browser (GAP-03). */
export function locationNames(own: readonly OwnLocation[] = []): (id: string | null | undefined) => string {
  return (id) => (id ? own.find((location) => location.id === id)?.name ?? referenceName('locations', id) : '—')
}

function merge(own: readonly OwnLocation[], remembered: readonly Location[]): KnownLocation[] {
  const byId = new Map<string, KnownLocation>()
  for (const location of remembered) byId.set(location.id, { ...location, own: false })
  for (const location of own) {
    const seen = byId.get(location.id)
    byId.set(location.id, seen
      ? { ...seen, own: true }
      : { id: location.id, name: location.name, type: location.type, address: '', active: true, own: true })
  }
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, 'uk'))
}

/**
 * Every location this browser knows: the user's own (from /auth/me) and those remembered here. The API cannot list
 * locations (GAP-03), so this is the best list a screen can offer. `active` leaves out deactivated ones the user has
 * no access to.
 */
export function useKnownLocations(own: readonly OwnLocation[] | undefined, options: { active?: boolean } = {}) {
  const remembered = useReferenceList('locations')
  const { active } = options
  const list = useMemo(() => {
    const known = merge(own ?? [], remembered.data ?? [])
    return active ? known.filter((location) => location.active || location.own) : known
  }, [own, remembered.data, active])
  const nameOf = (id: string) => list.find((location) => location.id === id)?.name ?? referenceName('locations', id)
  return { list, query: remembered, nameOf }
}

function knownUserName(id: string, self: Self | undefined): string | undefined {
  if (self?.id === id) return self.login
  const name = referenceName('users', id)
  return name.startsWith('#') ? undefined : name
}

/** A user's login: the viewer's own, or one this browser has seen, else a short id: the API has no user names (GAP-04). */
export function userNames(self?: Self): (id: string | null | undefined) => string {
  return (id) => (id ? knownUserName(id, self) ?? `користувач ${shortId(id)}` : '—')
}

/** Initials for a user's avatar; a user never seen here gets the first two characters of the id. */
export function userInitials(self?: Self): (id: string | null | undefined) => string {
  return (id) => {
    if (!id) return '—'
    const name = knownUserName(id, self)
    return name ? initials(name) : shortId(id).slice(0, 2)
  }
}
