import { useMutation, useQueryClient } from '@tanstack/react-query'
import { returnApi, saleKeys, type ItemCondition } from '@/entities/sale'

export interface ReturnDraft {
  sale: string
  book: string
  title: string
  quantity: number
  reason: string
  condition: ItemCondition
}

export function useCreateReturn() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (draft: ReturnDraft) => {
      const { id } = await returnApi.create(draft.sale, [{ book: draft.book, quantity: draft.quantity }], draft.reason, draft.condition)
      returnApi.rememberPending({ ...draft, id, at: new Date().toISOString() })
      return id
    },
    onSuccess: () => client.invalidateQueries({ queryKey: saleKeys.pendingReturns }),
  })
}

export function useConfirmReturn() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await returnApi.confirm(id)
      returnApi.forgetPending(id)
    },
    onSuccess: () => client.invalidateQueries({ queryKey: saleKeys.pendingReturns }),
  })
}
