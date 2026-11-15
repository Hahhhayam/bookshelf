import { useSyncExternalStore } from 'react'
import { local } from '@/shared/lib'
import type { ViewerLocation } from './types'
import { useViewer } from './useViewer'

const key = 'bookshelf.location'
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Picks the store or warehouse the user works in now; remembered per browser. */
export function setWorkingLocation(id: string) {
  local.set(key, id)
  listeners.forEach((listener) => listener())
}

/**
 * The location every per-location screen works in. Falls back to the user's first location when nothing is chosen,
 * or when the chosen one is no longer theirs.
 */
export function useWorkingLocation(): ViewerLocation | undefined {
  const chosen = useSyncExternalStore(subscribe, () => local.get(key))
  const locations = useViewer().data?.locations ?? []
  return locations.find((location) => location.id === chosen) ?? locations[0]
}
