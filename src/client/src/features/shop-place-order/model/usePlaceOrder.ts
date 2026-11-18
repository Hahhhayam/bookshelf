import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookKeys } from '@/entities/book'
import { cartKeys } from '@/entities/cart'
import { orderApi, orderKeys, type PlaceOrder } from '@/entities/order'

export type PlaceOrderInput = Omit<PlaceOrder, 'type'>

/**
 * Turns the customer's server cart into an order. The server clears the cart only when the order is placed, so a
 * retry after a refusal places the same cart again.
 */
export function usePlaceOrder() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: PlaceOrderInput) => orderApi.place({ ...input, type: 'Retail' }),
    onSuccess: (_, input) => Promise.all([
      client.invalidateQueries({ queryKey: bookKeys.all }),
      client.invalidateQueries({ queryKey: cartKeys.of(input.customer) }),
      client.invalidateQueries({ queryKey: orderKeys.ofCustomer(input.customer) }),
    ]),
  })
}
