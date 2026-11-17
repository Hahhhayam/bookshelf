import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseOrderApi, purchaseOrderKeys } from '@/entities/purchase-order'

export function useCancelOrder() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => purchaseOrderApi.cancel(id),
    onSettled: () => client.invalidateQueries({ queryKey: purchaseOrderKeys.all }),
  })
}
