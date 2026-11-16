import { http } from '@/shared/api'
import type { AuditFilter, AuditRecord } from '../model/types'

export const auditApi = {
  find: (filter: AuditFilter) => http.get<AuditRecord[]>('audit', { query: { ...filter } }),
}
