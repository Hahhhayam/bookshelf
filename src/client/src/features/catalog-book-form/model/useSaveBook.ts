import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookApi, bookKeys } from '@/entities/book'
import { toDraft, type BookFormValues } from './schema'

export function useAddBook() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (values: BookFormValues) => bookApi.add(toDraft(values)),
    onSuccess: async (_created, values) => {
      await client.invalidateQueries({ queryKey: bookKeys.all })
      notifications.show({ color: 'green', message: `«${values.title}» додано до каталогу` })
    },
  })
}

/** Saves the details; the price changes only through its own dialog, and type and ISBN never change. */
export function useUpdateBook(id: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (values: BookFormValues) => {
      const { title, barcode, category, authors, publisher } = toDraft(values)
      return bookApi.update(id, { title, barcode, category, authors, publisher })
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: bookKeys.all })
      notifications.show({ color: 'green', message: 'Зміни збережено' })
    },
  })
}
