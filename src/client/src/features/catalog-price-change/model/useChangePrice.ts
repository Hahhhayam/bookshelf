import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookApi, bookKeys } from '@/entities/book'
import type { Money } from '@/shared/api'
import { formatMoney } from '@/shared/lib'

export function useChangePrice(bookId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (newPrice: Money) => bookApi.changePrice(bookId, newPrice),
    onSuccess: async (_none, newPrice) => {
      await client.invalidateQueries({ queryKey: bookKeys.all })
      notifications.show({ color: 'green', message: `Нова ціна ${formatMoney(newPrice)} діє з цієї хвилини` })
    },
  })
}
