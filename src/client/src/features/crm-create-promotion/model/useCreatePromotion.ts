import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { referenceApi, useRefreshReference } from '@/entities/reference'
import { toPromotion, type PromotionValues } from './schema'

export function useCreatePromotion() {
  const refresh = useRefreshReference()
  return useMutation({
    mutationFn: (values: PromotionValues) => referenceApi.createPromotion(toPromotion(values)),
    onSuccess: async (_id, values) => {
      await refresh('promotions')
      notifications.show({ color: 'green', message: `Акцію «${values.name.trim()}» створено; каси застосовують її автоматично` })
    },
  })
}
