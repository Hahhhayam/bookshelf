import { useQuery } from '@tanstack/react-query'
import { auditApi } from '../api/auditApi'
import type { AuditFilter } from './types'

export const auditKeys = {
  find: (filter: AuditFilter) => ['audit', filter] as const,
}

export function useAudit(filter: AuditFilter, enabled = true) {
  return useQuery({ queryKey: auditKeys.find(filter), queryFn: () => auditApi.find(filter), enabled })
}
