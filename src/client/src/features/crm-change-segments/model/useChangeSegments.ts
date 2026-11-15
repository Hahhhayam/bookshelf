import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { customerApi, customerKeys } from '@/entities/customer'

export function useChangeSegments(customerId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (segments: string[]) => customerApi.changeSegments(customerId, segments),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: customerKeys.card(customerId) })
      notifications.show({ color: 'green', message: 'Сегменти клієнта оновлено' })
    },
  })
}
