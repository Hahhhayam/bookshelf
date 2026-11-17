import type { StatusTone } from '@/shared/config/tokens'
import { shortId } from '@/shared/lib'

/** A key field of the audited entity with its value before and after the action (FR-17); null when absent. */
export interface AuditFieldChange {
  field: string
  before: string | null
  after: string | null
}

export interface AuditRecord {
  id: string
  /** Null for a system action. */
  by: string | null
  byLogin: string | null
  at: string
  action: string
  subject: string | null
  changes: AuditFieldChange[]
}

export interface AuditFilter {
  subject?: string
  action?: string
  from?: string
  to?: string
}

/** The action codes the server writes. Refusals and removals are red, changes blue, the rest neutral. */
export const auditAction: Record<string, { label: string; tone: StatusTone }> = {
  'book.created': { label: 'Додано книгу', tone: 'draft' },
  'book.updated': { label: 'Змінено книгу', tone: 'progress' },
  'book.price-changed': { label: 'Змінено ціну', tone: 'progress' },
  'book.price-scheduled': { label: 'Заплановано ціну', tone: 'progress' },
  'book.deactivated': { label: 'Книгу деактивовано', tone: 'problem' },
  'book.activated': { label: 'Книгу повернуто в продаж', tone: 'progress' },
  'book.deleted': { label: 'Книгу видалено', tone: 'problem' },
  'stock.adjusted': { label: 'Коригування залишку', tone: 'progress' },
  'stock.written-off': { label: 'Списання', tone: 'problem' },
  'inventory-count.posted': { label: 'Проведено інвентаризацію', tone: 'draft' },
  'return.confirmed': { label: 'Підтверджено повернення', tone: 'draft' },
  'sale.cancelled': { label: 'Скасовано продаж', tone: 'problem' },
  'user.created': { label: 'Створено користувача', tone: 'draft' },
  'user.blocked': { label: 'Заблоковано користувача', tone: 'problem' },
  'user.unblocked': { label: 'Розблоковано користувача', tone: 'progress' },
  'user.access-changed': { label: 'Змінено права користувача', tone: 'progress' },
  'role.created': { label: 'Створено роль', tone: 'draft' },
  'role.changed': { label: 'Змінено роль', tone: 'progress' },
  'location.created': { label: 'Створено локацію', tone: 'draft' },
  'location.activated': { label: 'Локацію активовано', tone: 'draft' },
  'location.deactivated': { label: 'Локацію деактивовано', tone: 'problem' },
  'login.failed': { label: 'Невдалий вхід', tone: 'problem' },
  'promotion.created': { label: 'Створено акцію', tone: 'draft' },
  'gift-certificate.issued': { label: 'Випущено сертифікат', tone: 'draft' },
  'integration.created': { label: 'Додано інтеграцію', tone: 'draft' },
  'integration.enabled': { label: 'Інтеграцію увімкнено', tone: 'draft' },
  'integration.disabled': { label: 'Інтеграцію вимкнено', tone: 'problem' },
}

/** Labels of the key fields the server records; an unknown field is shown by its code. */
export const auditFieldLabel: Record<string, string> = {
  title: 'Назва', price: 'Ціна', effectiveFrom: 'Діє з', status: 'Стан', barcode: 'Штрихкод', category: 'Категорія',
  publisher: 'Видавництво', authors: 'Автори', name: 'Назва', login: 'Логін', roles: 'Ролі', locations: 'Локації',
  permissions: 'Права', reason: 'Причина', kind: 'Тип', type: 'Тип', address: 'Адреса', active: 'Активний',
  enabled: 'Увімкнено', onHand: 'Залишок', adjustments: 'Коригувань', total: 'Сума', refund: 'Повернено',
  value: 'Номінал', discountPercent: 'Знижка, %',
}

const valueLabel: Record<string, string> = {
  True: 'так', False: 'ні', Active: 'активний', Blocked: 'заблокований', Deactivated: 'знято з продажу',
  Store: 'магазин', Warehouse: 'склад', CentralWarehouse: 'центральний склад',
}

/** A recorded value as the interface shows it: yes/no and states in words, the rest as is. */
export function auditValueText(value: string): string {
  return valueLabel[value] ?? value
}

/** An action code the client does not know yet is shown as is. */
export function auditActionBadge(action: string): { label: string; tone: StatusTone } {
  return auditAction[action] ?? { label: action, tone: 'draft' }
}

export const auditActionOptions = Object.entries(auditAction)
  .map(([value, { label }]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label, 'uk'))

export type AuditSubjectKind =
  | 'users' | 'roles' | 'locations' | 'integrations' | 'promotions' | 'authors' | 'publishers' | 'suppliers'

const subjectKindByPrefix: Record<string, AuditSubjectKind> = {
  user: 'users', role: 'roles', location: 'locations', integration: 'integrations', promotion: 'promotions',
  author: 'authors', publisher: 'publishers', supplier: 'suppliers',
}

const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** A readable subject: `nameOf` names users, roles, locations…, other records get a short id. */
export function auditSubjectLabel(
  action: string,
  subject: string | null,
  nameOf: (kind: AuditSubjectKind, id: string) => string,
): string {
  if (!subject) return '—'
  if (!guid.test(subject)) return subject
  const kind = subjectKindByPrefix[action.split('.')[0] ?? '']
  return kind ? nameOf(kind, subject) : `#${shortId(subject)}`
}
