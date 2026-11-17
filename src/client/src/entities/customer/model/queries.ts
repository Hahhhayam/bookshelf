import { useQuery } from '@tanstack/react-query'
import { customerApi } from '../api/customerApi'

export const customerKeys = {
  card: (id: string) => ['customers', 'card', id] as const,
  byCard: (card: string) => ['customers', 'by-card', card] as const,
  bonuses: (id: string) => ['customers', 'bonuses', id] as const,
}

export function useBonusSummary(id: string | null | undefined) {
  return useQuery({ queryKey: customerKeys.bonuses(id ?? ''), queryFn: () => customerApi.bonuses(id!), enabled: !!id, retry: false })
}

export function useCustomer(id: string | undefined) {
  return useQuery({ queryKey: customerKeys.card(id ?? ''), queryFn: () => customerApi.card(id!), enabled: !!id })
}

export function useCustomerByCard(card: string | undefined) {
  return useQuery({
    queryKey: customerKeys.byCard(card ?? ''),
    queryFn: () => customerApi.byCard(card!),
    enabled: !!card,
    retry: false,
  })
}
