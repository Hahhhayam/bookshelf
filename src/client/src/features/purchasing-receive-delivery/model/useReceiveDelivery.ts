import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseOrderApi, purchaseOrderKeys } from '@/entities/purchase-order'
import { stockKeys } from '@/entities/stock'
import { receivedItems, type ReceivingLine } from './receivingLines'

export interface DeliveryInput {
  location: string
  order: string | null
  supplier: string | null
  lines: readonly ReceivingLine[]
}

/**
 * Confirms the delivery: stock rises and the order's received quantities move. The server has no idempotency key
 * for deliveries (B-36), so a retry after a lost answer could receive twice; the page blocks a second submit.
 */
export function useReceiveDelivery() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ location, order, supplier, lines }: DeliveryInput) =>
      purchaseOrderApi.receiveDelivery(location, order, order ? null : supplier, receivedItems(lines)),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: purchaseOrderKeys.all })
      void client.invalidateQueries({ queryKey: stockKeys.all })
    },
  })
}
