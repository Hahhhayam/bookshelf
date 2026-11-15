import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { customerApi } from '@/entities/customer'
import type { CustomerValues } from './schema'

export function useRegisterCustomer() {
  return useMutation({
    mutationFn: (v: CustomerValues) =>
      customerApi.register(v.name.trim(), v.phone.trim() || null, v.email.trim() || null, v.cardNumber.trim()),
    onSuccess: (_created, v) => notifications.show({ color: 'green', message: `Клієнта ${v.name.trim()} зареєстровано` }),
  })
}
