import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseOrderApi, purchaseOrderKeys } from '@/entities/purchase-order'

export function useSendOrder() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => purchaseOrderApi.send(id),
    onSettled: () => client.invalidateQueries({ queryKey: purchaseOrderKeys.all }),
  })
}
