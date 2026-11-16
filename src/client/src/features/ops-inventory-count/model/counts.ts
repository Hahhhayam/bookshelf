import { useMutation, useQueryClient } from '@tanstack/react-query'
import { countApi, countKeys } from '@/entities/inventory-count'
import { stockKeys } from '@/entities/stock'

function useInvalidateCounts() {
  const client = useQueryClient()
  return () => client.invalidateQueries({ queryKey: countKeys.all })
}

export function useStartCount() {
  const invalidate = useInvalidateCounts()
  return useMutation({ mutationFn: (location: string) => countApi.start(location), onSuccess: invalidate })
}

export function useRecordCount(id: string) {
  const invalidate = useInvalidateCounts()
  return useMutation({
    mutationFn: ({ book, counted }: { book: string; counted: number }) => countApi.record(id, book, counted),
    onSettled: invalidate,
  })
}

export function useCountStep(id: string, step: 'complete' | 'approve') {
  const client = useQueryClient()
  return useMutation({
    mutationFn: () => (step === 'complete' ? countApi.complete(id) : countApi.approve(id)),
    onSettled: () => Promise.all([
      client.invalidateQueries({ queryKey: countKeys.all }),
      client.invalidateQueries({ queryKey: stockKeys.all }),
    ]),
  })
}
