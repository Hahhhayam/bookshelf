import { useSyncExternalStore } from 'react'
import type { Money } from '@/shared/api'
import { local, readJson, writeJson } from '@/shared/lib'

export interface CartLine {
  book: string
  title: string
  price: Money
  quantity: number
}

/**
 * The shop cart lives in the browser. The API can only add to a server cart, never read or reduce it (GAP-01), so
 * the lines are sent to the server once, right before the order is placed.
 */
const key = 'bookshelf.cart'
const listeners = new Set<() => void>()
let snapshot = readJson<CartLine[]>(local, key, [])

function commit(lines: CartLine[]) {
  snapshot = lines
  writeJson(local, key, lines)
  listeners.forEach((listener) => listener())
}

export const cart = {
  add(line: Omit<CartLine, 'quantity'>, quantity = 1) {
    const existing = snapshot.find((l) => l.book === line.book)
    commit(existing
      ? snapshot.map((l) => (l.book === line.book ? { ...l, quantity: l.quantity + quantity } : l))
      : [...snapshot, { ...line, quantity }])
  },
  setQuantity(book: string, quantity: number) {
    commit(quantity <= 0 ? snapshot.filter((l) => l.book !== book) : snapshot.map((l) => (l.book === book ? { ...l, quantity } : l)))
  },
  remove(book: string) {
    commit(snapshot.filter((l) => l.book !== book))
  },
  clear() {
    commit([])
  },
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => listeners.delete(listener) },
    () => snapshot,
  )
}

export function cartTotal(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.price.amount * line.quantity, 0)
}
