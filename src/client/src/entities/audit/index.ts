import { useQuery } from '@tanstack/react-query'
import { http } from '@/shared/api'

export interface AuditRecord {
  id: string
  by: string | null
  at: string
  action: string
  subject: string | null
  before: string | null
  after: string | null
}

export interface AuditFilter {
  subject?: string
  action?: string
  from?: string
  to?: string
}

export const auditApi = {
  find: (filter: AuditFilter) => http.get<AuditRecord[]>('audit', { query: { ...filter } }),
}

export function useAudit(filter: AuditFilter, enabled = true) {
  return useQuery({ queryKey: ['audit', filter], queryFn: () => auditApi.find(filter), enabled })
}

/** Readable names for the action codes the server writes. */
export const auditActionLabel: Record<string, string> = {
  'book.created': 'Додано книгу',
  'book.updated': 'Змінено книгу',
  'book.price-changed': 'Змінено ціну',
  'book.deactivated': 'Книгу деактивовано',
  'book.deleted': 'Книгу видалено',
  'stock.adjusted': 'Коригування залишку',
  'stock.written-off': 'Списання',
  'inventory-count.posted': 'Проведено інвентаризацію',
  'return.confirmed': 'Підтверджено повернення',
  'sale.cancelled': 'Скасовано продаж',
  'user.created': 'Створено користувача',
  'user.blocked': 'Заблоковано користувача',
  'user.unblocked': 'Розблоковано користувача',
  'user.access-changed': 'Змінено права користувача',
  'role.created': 'Створено роль',
  'role.changed': 'Змінено роль',
  'location.created': 'Створено локацію',
  'location.activated': 'Локацію активовано',
  'location.deactivated': 'Локацію деактивовано',
  'login.failed': 'Невдалий вхід',
  'promotion.created': 'Створено акцію',
  'gift-certificate.issued': 'Випущено сертифікат',
  'integration.created': 'Додано інтеграцію',
  'integration.enabled': 'Інтеграцію увімкнено',
  'integration.disabled': 'Інтеграцію вимкнено',
}
