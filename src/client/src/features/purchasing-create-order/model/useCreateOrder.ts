import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseOrderApi, purchaseOrderKeys } from '@/entities/purchase-order'
import { uah } from '@/shared/api'
import type { OrderDraft } from './useOrderDraft'

/** Creates the order as a draft and answers with its id. */
export function useCreateOrder() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (draft: OrderDraft) => {
      const lines = draft.lines.map((line) => ({ book: line.book, quantity: line.quantity, purchasePrice: uah(line.price) }))
      const { id } = await purchaseOrderApi.create(draft.supplier!, draft.expectedDate, lines)
      return id
    },
    onSettled: () => client.invalidateQueries({ queryKey: purchaseOrderKeys.all }),
  })
}
