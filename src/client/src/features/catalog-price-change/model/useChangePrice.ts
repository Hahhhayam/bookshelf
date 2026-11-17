import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookApi, bookKeys } from '@/entities/book'
import type { Money } from '@/shared/api'
import { formatDateTime, formatMoney } from '@/shared/lib'

export interface PriceChange {
  newPrice: Money
  /** ISO moment the price starts; null for at once. */
  effectiveFrom: string | null
}

export function useChangePrice(bookId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ newPrice, effectiveFrom }: PriceChange) => bookApi.changePrice(bookId, newPrice, effectiveFrom),
    onSuccess: async (_none, { newPrice, effectiveFrom }) => {
      await client.invalidateQueries({ queryKey: bookKeys.all })
      const when = effectiveFrom ? `з ${formatDateTime(effectiveFrom)}` : 'з цієї хвилини'
      notifications.show({ color: 'green', message: `Нова ціна ${formatMoney(newPrice)} діє ${when}` })
    },
  })
}
