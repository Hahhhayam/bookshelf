import { http, type Created } from '@/shared/api'
import type { TransferCard, TransferStatus, TransferSummary } from '../model/types'

export interface TransferItem {
  book: string
  quantity: number
}

export const transferApi = {
  list: (location: string, status?: TransferStatus) =>
    http.get<TransferSummary[]>(`locations/${location}/transfers`, { query: { status } }),
  card: (id: string) => http.get<TransferCard>(`transfers/${id}`),
  create: (from: string, to: string, items: TransferItem[]) => http.post<Created>('transfers', { from, to, items }),
  approve: (id: string) => http.post(`transfers/${id}/approve`),
  ship: (id: string) => http.post(`transfers/${id}/ship`),
  receive: (id: string, received: TransferItem[]) => http.post(`transfers/${id}/receive`, { received }),
  resolveDiscrepancy: (id: string, discrepancy: string, reason: string) =>
    http.post(`transfers/${id}/discrepancies/${discrepancy}/resolve`, { reason }),
}
