import { useDebouncedValue } from '@mantine/hooks'
import { useMemo, useState } from 'react'
import type { AuditFilter } from '@/entities/audit'
import { dayEnd, dayStart, toInputDate } from '@/shared/lib'

function lastWeek() {
  const today = new Date()
  return { from: toInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)), to: toInputDate(today) }
}

/** Audit filters; either end of the period may be left empty. By default the log shows the last 7 days. */
export function useAuditFilter() {
  const [subject, setSubject] = useState('')
  const [action, setAction] = useState<string | null>(null)
  const [period, setPeriod] = useState(lastWeek)
  const [debouncedSubject] = useDebouncedValue(subject.trim(), 400)

  const fromIso = dayStart(period.from)?.toISOString()
  const toIso = dayEnd(period.to)?.toISOString()
  const periodValid = !fromIso || !toIso || fromIso <= toIso

  const filter = useMemo<AuditFilter>(() => ({
    subject: debouncedSubject || undefined,
    action: action ?? undefined,
    from: fromIso,
    to: toIso,
  }), [debouncedSubject, action, fromIso, toIso])

  const enabled = periodValid
  const reset = () => {
    setSubject('')
    setAction(null)
    setPeriod(lastWeek())
  }
  return { subject, setSubject, action, setAction, period, setPeriod, periodValid, filter, enabled, reset }
}

export type AuditFilterState = ReturnType<typeof useAuditFilter>
