import { Text, Timeline } from '@mantine/core'
import type { HistoryEntry } from '@/shared/api'
import { formatDateTime, shortId } from '@/shared/lib'

/** A document's status changes, oldest first, with who made each one. */
export function HistoryTimeline({ entries, label, userName }: {
  entries: readonly HistoryEntry[]
  label: (status: string) => string
  userName?: (userId: string) => string
}) {
  if (entries.length === 0) return <Text c="dimmed" size="sm">Змін статусу ще не було.</Text>
  return (
    <Timeline active={entries.length - 1} bulletSize={12} lineWidth={2}>
      {entries.map((entry) => (
        <Timeline.Item key={`${entry.at}-${entry.to}`} title={`${label(entry.from)} → ${label(entry.to)}`}>
          <Text size="sm" c="dimmed">
            {formatDateTime(entry.at)} · {userName ? userName(entry.by) : `користувач ${shortId(entry.by)}`}
          </Text>
        </Timeline.Item>
      ))}
    </Timeline>
  )
}
