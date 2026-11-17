import { useQuery } from '@tanstack/react-query'
import { cartApi } from '../api/cartApi'
import type { Cart, CartLine } from './types'

export const cartKeys = {
  all: ['cart'] as const,
  of: (customer: string) => ['cart', customer] as const,
}

const empty: Cart = { lines: [], total: null }

/** The customer's server cart; without a customer there is nothing to read, so it is empty. */
export function useCart(customer: string | null) {
  return useQuery({
    queryKey: cartKeys.of(customer ?? ''),
    queryFn: () => (customer ? cartApi.get(customer) : Promise.resolve(empty)),
  })
}

export function cartCount(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}
