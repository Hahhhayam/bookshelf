import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookApi, bookKeys, type RemovalMode } from '@/entities/book'

export const removalText: Record<RemovalMode, string> = {
  Deactivate: 'Книгу деактивовано, бо на неї є відкриті замовлення або залишки. Вона зникла з кас і магазину, але лишилася в документах.',
  Delete: 'Книгу видалено з каталогу.',
}

/** The server decides: it deletes the book, or only deactivates it when something still depends on it. */
export function useRemoveBook(bookId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: () => bookApi.remove(bookId),
    onSuccess: async ({ mode }) => {
      await client.invalidateQueries({ queryKey: bookKeys.all })
      notifications.show({ color: mode === 'Delete' ? 'green' : 'yellow', message: removalText[mode] })
    },
  })
}
