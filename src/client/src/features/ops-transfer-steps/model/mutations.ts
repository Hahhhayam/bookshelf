import { useMutation, useQueryClient } from '@tanstack/react-query'
import { stockKeys } from '@/entities/stock'
import { transferApi, transferKeys, type TransferItem } from '@/entities/transfer'

function useInvalidate() {
  const client = useQueryClient()
  return () => Promise.all([
    client.invalidateQueries({ queryKey: transferKeys.all }),
    client.invalidateQueries({ queryKey: stockKeys.all }),
  ])
}

export function useApproveOrShip(id: string, kind: 'approve' | 'ship') {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: () => (kind === 'approve' ? transferApi.approve(id) : transferApi.ship(id)),
    onSettled: invalidate,
  })
}

export function useReceiveTransfer(id: string) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (received: TransferItem[]) => transferApi.receive(id, received),
    onSettled: invalidate,
  })
}

export function useCreateTransfer() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ from, to, items }: { from: string; to: string; items: TransferItem[] }) => transferApi.create(from, to, items),
    onSuccess: invalidate,
  })
}
