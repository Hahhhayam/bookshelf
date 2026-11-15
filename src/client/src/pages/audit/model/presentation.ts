import { auditActionLabel } from '@/entities/audit'
import { referenceName, type ReferenceKind } from '@/entities/reference'
import type { StatusTone } from '@/shared/config/tokens'
import { shortId } from '@/shared/lib'

/** Tone of an action badge by the end of its code: refusals and removals red, changes blue, the rest neutral. */
const toneBySuffix: [RegExp, StatusTone][] = [
  [/(blocked|deactivated|deleted|cancelled|written-off|failed|disabled)$/, 'problem'],
  [/(changed|updated|adjusted|access-changed)$/, 'progress'],
]

export function actionTone(action: string): StatusTone {
  return toneBySuffix.find(([pattern]) => pattern.test(action))?.[1] ?? 'draft'
}

export function actionLabel(action: string): string {
  return auditActionLabel[action] ?? action
}

export const actionOptions = Object.entries(auditActionLabel)
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label, 'uk'))

const kindByPrefix: Record<string, ReferenceKind> = {
  user: 'users', role: 'roles', location: 'locations', integration: 'integrations', promotion: 'promotions',
}

const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** A readable subject: the remembered name for users, roles, locations…, a short id for other records. */
export function subjectLabel(action: string, subject: string | null): string {
  if (!subject) return '—'
  if (!guid.test(subject)) return subject
  const kind = kindByPrefix[action.split('.')[0] ?? '']
  return kind ? referenceName(kind, subject) : `#${shortId(subject)}`
}
