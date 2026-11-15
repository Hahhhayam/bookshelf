import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseOrderApi, purchaseOrderKeys } from '@/entities/purchase-order'
import { uah } from '@/shared/api'
import type { OrderDraft } from './useOrderDraft'

export class SendAfterCreateError extends Error {
  readonly id: string
  readonly sendError: unknown

  constructor(id: string, sendError: unknown) {
    super('Order created, but sending failed')
    this.id = id
    this.sendError = sendError
  }
}

/**
 * Creates the order and, when asked, sends it right away. If sending fails the order still exists as a draft,
 * so the error carries its id and the page can open it.
 */
export function useCreateOrder() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async ({ draft, send }: { draft: OrderDraft; send: boolean }) => {
      const lines = draft.lines.map((line) => ({ book: line.book, quantity: line.quantity, purchasePrice: uah(line.price) }))
      const { id } = await purchaseOrderApi.create(draft.supplier!, draft.expectedDate, lines)
      if (send) {
        try {
          await purchaseOrderApi.send(id)
        } catch (error) {
          throw new SendAfterCreateError(id, error)
        }
      }
      return id
    },
    onSettled: () => client.invalidateQueries({ queryKey: purchaseOrderKeys.all }),
  })
}
