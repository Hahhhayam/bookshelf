import { useDebouncedValue } from '@mantine/hooks'
import { useMemo, useState } from 'react'
import type { AuditFilter } from '@/entities/audit'

const pad = (n: number) => String(n).padStart(2, '0')
const inputDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

function localDay(value: string, end: boolean): Date | null {
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return end ? new Date(y, m - 1, d, 23, 59, 59, 999) : new Date(y, m - 1, d)
}

function lastWeek() {
  const today = new Date()
  return { from: inputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)), to: inputDate(today) }
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

  const from = localDay(period.from, false)
  const to = localDay(period.to, true)
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
