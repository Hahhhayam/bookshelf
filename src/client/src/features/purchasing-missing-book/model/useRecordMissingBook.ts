import { useMutation, useQueryClient } from '@tanstack/react-query'
import { missingBookKeys, purchaseOrderApi } from '@/entities/purchase-order'

/** A repeated request for the same title raises its demand on the server instead of adding a duplicate. */
export function useRecordMissingBook(location: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ title, author }: { title: string; author: string | null }) =>
      purchaseOrderApi.recordMissingBook(title, author, location, null),
    onSuccess: () => client.invalidateQueries({ queryKey: missingBookKeys.all }),
  })
}
