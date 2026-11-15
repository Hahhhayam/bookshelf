import { useMutation } from '@tanstack/react-query'
import { bookApi } from '@/entities/book'

/** One scan: an ISBN goes to the ISBN filter, anything else to text search (no barcode filter yet, GAP-06). */
export function useBookLookup() {
  return useMutation({ mutationFn: (code: string) => bookApi.findByCode(code) })
}
