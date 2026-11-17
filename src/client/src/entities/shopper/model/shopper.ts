import { useSyncExternalStore } from 'react'
import { local } from '@/shared/lib'

/**
 * Who is shopping. Customers have no login (the report gives them none), so the shop acts for a customer id set in the
 * build (VITE_SHOP_CUSTOMER_ID) or entered once and remembered in this browser. The server keeps the cart under it.
 */
const key = 'bookshelf.shopper'
const listeners = new Set<() => void>()
const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isShopperId = (value: string) => guid.test(value.trim())

export const shopper = {
  id: (): string | null => local.get(key) ?? (import.meta.env.VITE_SHOP_CUSTOMER_ID as string | undefined) ?? null,
  set(id: string) {
    local.set(key, id.trim())
    listeners.forEach((listener) => listener())
  },
}

export function useShopperId(): string | null {
  return useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => listeners.delete(listener) },
    shopper.id,
  )
}
