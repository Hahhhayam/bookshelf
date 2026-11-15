import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi, orderKeys, type OrderStatus } from '@/entities/order'

export function useChangeOrderStatus() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => orderApi.changeStatus(id, status),
    onSettled: () => client.invalidateQueries({ queryKey: orderKeys.all }),
  })
}
