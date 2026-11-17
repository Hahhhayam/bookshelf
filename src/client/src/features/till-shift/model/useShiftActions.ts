import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saleKeys, shiftApi } from '@/entities/sale'

/** Opening and closing the store's till shift (table 1.1: the store administrator controls shifts). */
export function useShiftActions(locationId: string) {
  const client = useQueryClient()
  const refresh = () => client.invalidateQueries({ queryKey: saleKeys.shift(locationId) })
  const open = useMutation({ mutationFn: () => shiftApi.open(locationId), onSuccess: refresh })
  const close = useMutation({ mutationFn: (id: string) => shiftApi.close(id), onSuccess: refresh })
  return { open, close }
}
