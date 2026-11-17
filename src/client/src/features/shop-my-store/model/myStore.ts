import { useSyncExternalStore } from 'react'
import { local } from '@/shared/lib'

/** The shopper's preferred store, remembered in this browser. */
const key = 'bookshelf.shop.myStore'
const listeners = new Set<() => void>()

export const myStore = {
  get: (): string | null => local.get(key),
  set(location: string | null) {
    if (location) local.set(key, location)
    else local.remove(key)
    listeners.forEach((listener) => listener())
  },
}

export function useMyStore(): string | null {
  return useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => listeners.delete(listener) },
    myStore.get,
  )
}
