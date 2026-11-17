import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { deliveryKeys, purchaseOrderApi, purchaseOrderKeys } from '@/entities/purchase-order'
import { stockKeys } from '@/entities/stock'
import { newKey } from '@/shared/lib'
import { receivedItems, type ReceivingLine } from './receivingLines'

export interface DeliveryInput {
  location: string
  order: string | null
  supplier: string | null
  lines: readonly ReceivingLine[]
}

/**
 * Confirms the delivery: stock rises and the order's received quantities move. The operation key is made once per
 * delivery (mount the caller with a `key` per delivery) and survives failed attempts, so a retry receives only once.
 */
export function useReceiveDelivery() {
  const client = useQueryClient()
  const [operationKey] = useState(() => newKey('delivery'))
  return useMutation({
    mutationFn: ({ location, order, supplier, lines }: DeliveryInput) =>
      purchaseOrderApi.receiveDelivery(location, order, order ? null : supplier, receivedItems(lines), operationKey),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: purchaseOrderKeys.all })
      void client.invalidateQueries({ queryKey: deliveryKeys.all })
      void client.invalidateQueries({ queryKey: stockKeys.all })
    },
  })
}
