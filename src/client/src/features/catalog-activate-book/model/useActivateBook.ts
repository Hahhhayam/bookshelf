import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookApi, bookKeys } from '@/entities/book'

/** Puts a deactivated book back on sale: it returns to the tills and the shop. */
export function useActivateBook(bookId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: () => bookApi.setActive(bookId, true),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: bookKeys.all })
      notifications.show({ color: 'green', message: 'Книгу повернуто в продаж' })
    },
  })
}
