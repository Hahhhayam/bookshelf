import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { saleApi, type ItemCondition } from '@/entities/sale'
import { pendingReturns } from './pendingReturns'

const pendingKey = ['till-returns', 'pending'] as const

export function usePendingReturns() {
  return useQuery({ queryKey: pendingKey, queryFn: pendingReturns.list })
}

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
      const { id } = await saleApi.createReturn(draft.sale, [{ book: draft.book, quantity: draft.quantity }], draft.reason, draft.condition)
      pendingReturns.remember({ ...draft, id, at: new Date().toISOString() })
      return id
    },
    onSuccess: () => client.invalidateQueries({ queryKey: pendingKey }),
  })
}

export function useConfirmReturn() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await saleApi.confirmReturn(id)
      pendingReturns.forget(id)
    },
    onSuccess: () => client.invalidateQueries({ queryKey: pendingKey }),
  })
}
