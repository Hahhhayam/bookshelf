import { useMutation, useQueryClient } from '@tanstack/react-query'
import { stockApi, stockKeys } from '@/entities/stock'

/** Every cached stock list of the location, whatever its filter. */
const locationStock = (location: string) => stockKeys.location(location).slice(0, 2)

function useStockMutation<T>(location: string, call: (input: T) => Promise<unknown>) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: call,
    onSettled: () => client.invalidateQueries({ queryKey: locationStock(location) }),
  })
}

export const useSetMinimum = (location: string) =>
  useStockMutation(location, ({ book, minimum }: { book: string; minimum: number }) => stockApi.setMinimum(location, book, minimum))

export const useAdjustStock = (location: string) =>
  useStockMutation(location, ({ book, newOnHand, reason }: { book: string; newOnHand: number; reason: string }) =>
    stockApi.adjust(location, book, newOnHand, reason))

export const useWriteOff = (location: string) =>
  useStockMutation(location, ({ book, quantity, reason }: { book: string; quantity: number; reason: string }) =>
    stockApi.writeOff(location, reason, [{ book, quantity }]))
