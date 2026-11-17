import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi, cartKeys } from '@/entities/cart'

type Change = { book: string; quantity: number }

/** Changes a cart line's quantity (zero removes it) or removes the line, for the given customer's cart. */
export function useEditCart(customer: string) {
  const client = useQueryClient()
  const refresh = () => client.invalidateQueries({ queryKey: cartKeys.of(customer) })
  const setQuantity = useMutation({
    mutationFn: ({ book, quantity }: Change) => cartApi.setQuantity(customer, book, quantity),
    onSettled: refresh,
  })
  const remove = useMutation({ mutationFn: (book: string) => cartApi.remove(customer, book), onSettled: refresh })
  return { setQuantity, remove }
}
