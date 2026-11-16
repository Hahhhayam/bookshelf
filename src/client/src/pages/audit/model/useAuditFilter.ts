import { useDebouncedValue } from '@mantine/hooks'
import { useMemo, useState } from 'react'
import type { AuditFilter } from '@/entities/audit'
import { dayEnd, dayStart, toInputDate } from '@/shared/lib'

function lastWeek() {
  const today = new Date()
  return { from: toInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)), to: toInputDate(today) }
}

/**
 * Audit filters. The server applies a period only when both ends are given, so a half-filled period is left out;
 * by default the log shows the last 7 days.
 */
export function useAuditFilter() {
  const [subject, setSubject] = useState('')
  const [action, setAction] = useState<string | null>(null)
  const [period, setPeriod] = useState(lastWeek)
  const [debouncedSubject] = useDebouncedValue(subject.trim(), 400)

  const from = dayStart(period.from)
  const to = dayEnd(period.to)
  const periodValid = from !== null && to !== null && from <= to
  const fromIso = from?.toISOString()
  const toIso = to?.toISOString()

  const filter = useMemo<AuditFilter>(() => ({
    subject: debouncedSubject || undefined,
    action: action ?? undefined,
    from: periodValid ? fromIso : undefined,
    to: periodValid ? toIso : undefined,
  }), [debouncedSubject, action, periodValid, fromIso, toIso])

  const enabled = Boolean(filter.subject || filter.action || filter.from)
  const reset = () => {
    setSubject('')
    setAction(null)
    setPeriod(lastWeek())
  }
  return { subject, setSubject, action, setAction, period, setPeriod, periodValid, filter, enabled, reset }
}

export type AuditFilterState = ReturnType<typeof useAuditFilter>
