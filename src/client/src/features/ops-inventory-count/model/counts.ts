import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { countApi, type CountSession } from '@/entities/inventory-count'
import { stockKeys } from '@/entities/stock'
import type { StatusTone } from '@/shared/config/tokens'

export type CountStatus = CountSession['status']

export const countStatus: Record<CountStatus, { label: string; tone: StatusTone }> = {
  Open: { label: 'Триває', tone: 'progress' },
  Counted: { label: 'Пораховано', tone: 'ready' },
  Approved: { label: 'Затверджено', tone: 'done' },
}

export const countKeys = {
  all: ['inventory-counts'] as const,
  one: (id: string) => ['inventory-counts', id] as const,
}

/** Counts started in this browser: the API cannot read counts back (GAP-08). */
export function useCounts() {
  return useQuery({ queryKey: countKeys.all, queryFn: countApi.list })
}

export function useCount(id: string | undefined) {
  return useQuery({ queryKey: countKeys.one(id ?? ''), queryFn: () => countApi.get(id!), enabled: !!id })
}

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
      client.invalidateQueries({ queryKey: stockKeys.location('').slice(0, 1) }),
    ]),
  })
}
