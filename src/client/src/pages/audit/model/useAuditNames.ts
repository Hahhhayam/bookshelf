import { auditValueText, type AuditRecord, type AuditSubjectKind } from '@/entities/audit'
import { useReferenceNames, useUserNames, type ReferenceKind } from '@/entities/reference'
import { useCan } from '@/entities/viewer'
import { Perm } from '@/shared/lib'

/** Fields whose recorded values are ids (a comma-separated list for several), with the list that names them. */
const idFields: Record<string, ReferenceKind> = {
  roles: 'roles', locations: 'locations', category: 'categories', publisher: 'publishers', authors: 'authors',
}

/**
 * Names for the ids an audit record holds: its subject and the id-valued fields. Lists the viewer may not read stay
 * unloaded, and their ids show in a short form.
 */
export function useAuditNames() {
  const can = useCan()
  const users = useUserNames()
  const names: Record<AuditSubjectKind | 'categories', (id: string) => string> = {
    users,
    roles: useReferenceNames('roles', { enabled: can(Perm.UsersManage) }),
    locations: useReferenceNames('locations'),
    integrations: useReferenceNames('integrations', { enabled: can(Perm.IntegrationsManage) }),
    promotions: useReferenceNames('promotions', { enabled: can(Perm.PromotionsManage) }),
    authors: useReferenceNames('authors'),
    publishers: useReferenceNames('publishers'),
    categories: useReferenceNames('categories'),
    suppliers: useReferenceNames('suppliers', { enabled: can(Perm.PurchasingManage) || can(Perm.ReceivingConfirm) }),
  }

  const subjectName = (kind: AuditSubjectKind, id: string) => names[kind](id)
  const valueText = (field: string, value: string): string => {
    const kind = idFields[field]
    if (!kind || !(kind in names)) return auditValueText(value)
    const nameOf = names[kind as keyof typeof names]
    return value.split(',').map((id) => nameOf(id.trim())).join(', ')
  }
  const userName = (record: AuditRecord) => (!record.by ? 'Система' : record.byLogin ?? users(record.by))
  return { subjectName, valueText, userName }
}

export type AuditNames = ReturnType<typeof useAuditNames>
