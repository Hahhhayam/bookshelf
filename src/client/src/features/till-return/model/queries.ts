import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { returnApi, saleKeys, type ReturnDraft } from '@/entities/sale'
import { newKey } from '@/shared/lib'

/**
 * Creating a return. The operation key lives as long as the form's draft: a retry after a lost answer resends it, so
 * the return is not created twice; it changes only after a success.
 */
export function useCreateReturn(locationId: string) {
  const client = useQueryClient()
  const [key, setKey] = useState(() => newKey('return'))
  const mutation = useMutation({
    mutationFn: (draft: ReturnDraft) => returnApi.create(draft, key),
    onSuccess: async () => {
      setKey(newKey('return'))
      await client.invalidateQueries({ queryKey: saleKeys.pendingReturns(locationId) })
    },
  })
  return mutation
}

export function useConfirmReturn(locationId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => returnApi.confirm(id),
    onSuccess: () => client.invalidateQueries({ queryKey: saleKeys.pendingReturns(locationId) }),
  })
}
