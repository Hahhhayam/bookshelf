import { http, type Created } from '@/shared/api'
import type { BonusSummary, CustomerCard } from '../model/types'

export const customerApi = {
  card: (id: string) => http.get<CustomerCard>(`customers/${id}`),
  /** Cashiers find a customer by the card they scan. */
  byCard: (card: string) => http.get<CustomerCard>('customers', { query: { card } }),
  register: (name: string, phone: string | null, email: string | null, cardNumber: string) =>
    http.post<Created>('customers', { name, phone, email, cardNumber }),
  changeSegments: (id: string, segments: string[]) => http.put(`customers/${id}/segments`, { segments }),
  updateContact: (id: string, name: string, phone: string | null, email: string | null) =>
    http.put(`customers/${id}`, { name, phone, email }),
  /** The shop's buyer: tier and bonuses only, readable without a login. */
  bonuses: (id: string) => http.get<BonusSummary>(`customers/${id}/bonuses`),
}
