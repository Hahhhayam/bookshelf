import { http, type Created } from '@/shared/api'
import type { CountCard, CountSummary } from '../model/types'

export const countApi = {
  list: (location: string) => http.get<CountSummary[]>('inventory-counts', { query: { location } }),
  get: (id: string) => http.get<CountCard>(`inventory-counts/${id}`),
  start: async (location: string) => (await http.post<Created>('inventory-counts', { location })).id,
  record: (id: string, book: string, counted: number) => http.put(`inventory-counts/${id}/lines/${book}`, { counted }),
  complete: (id: string) => http.post(`inventory-counts/${id}/complete`),
  approve: (id: string) => http.post(`inventory-counts/${id}/approve`),
}
