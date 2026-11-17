import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi, cartKeys } from '@/entities/cart'

export function useAddToCart() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ customer, book, quantity }: { customer: string; book: string; quantity: number }) =>
      cartApi.add(customer, book, quantity),
    onSuccess: (_, { customer }) => client.invalidateQueries({ queryKey: cartKeys.of(customer) }),
  })
}
