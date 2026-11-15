import { useSyncExternalStore } from 'react'
import { local } from '@/shared/lib'

/**
 * Who is shopping. Customers have no login yet (GAP-02), so the shop acts for a customer id set in the build
 * (VITE_SHOP_CUSTOMER_ID) or entered once on the checkout page and remembered in this browser.
 */
const key = 'bookshelf.shopper'
const listeners = new Set<() => void>()

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
