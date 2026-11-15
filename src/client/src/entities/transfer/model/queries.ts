import { useQuery } from '@tanstack/react-query'
import { transferApi } from '../api/transferApi'
import type { TransferStatus } from './types'

export const transferKeys = {
  all: ['transfers'] as const,
  list: (location: string, status?: TransferStatus) => ['transfers', 'list', location, status ?? 'open'] as const,
  card: (id: string) => ['transfers', 'card', id] as const,
}

export function useTransfers(location: string | undefined, status?: TransferStatus) {
  return useQuery({
    queryKey: transferKeys.list(location ?? '', status),
    queryFn: () => transferApi.list(location!, status),
    enabled: !!location,
  })
}

export function useTransfer(id: string | undefined) {
  return useQuery({ queryKey: transferKeys.card(id ?? ''), queryFn: () => transferApi.card(id!), enabled: !!id })
}
