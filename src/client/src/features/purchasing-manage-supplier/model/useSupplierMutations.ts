import { useMutation } from '@tanstack/react-query'
import { referenceApi, useRefreshReference } from '@/entities/reference'

export interface SupplierInput {
  id?: string
  name: string
  contactInfo: string | null
}

/** Creates a supplier or updates an existing one; answers with its id. */
export function useSaveSupplier() {
  const refresh = useRefreshReference()
  return useMutation({
    mutationFn: async ({ id, name, contactInfo }: SupplierInput) => {
      if (!id) return referenceApi.createSupplier(name, contactInfo)
      await referenceApi.updateSupplier(id, name, contactInfo)
      return id
    },
    onSuccess: () => refresh('suppliers'),
  })
}

export function useSetSupplierActive() {
  const refresh = useRefreshReference()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => referenceApi.setSupplierActive(id, active),
    onSuccess: () => refresh('suppliers'),
  })
}
