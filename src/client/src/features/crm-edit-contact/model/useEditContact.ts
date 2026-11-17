import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { customerApi } from '@/entities/customer'
import type { ContactValues } from './schema'

export function useEditContact(customerId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (v: ContactValues) => customerApi.updateContact(customerId, v.name.trim(), v.phone.trim() || null, v.email.trim() || null),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ['customers'] })
      notifications.show({ color: 'green', message: 'Контакти клієнта оновлено' })
    },
  })
}
