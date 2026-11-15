import { Anchor, Badge, Group, Stack, Tabs, Text, Title } from '@mantine/core'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { userName } from '@/features/ops-names'
import type { HistoryEntry } from '@/shared/api'
import type { StatusTone } from '@/shared/config/tokens'
import { tokens } from '@/shared/config/tokens'
import { formatDateTime } from '@/shared/lib'
import { HistoryTimeline, Panel, StatusBadge } from '@/shared/ui'
import { FactGrid, type Fact } from './FactGrid'

export interface DocumentTab {
  value: string
  label: string
  count?: number
  content: ReactNode
}

/**
 * A document card (Document artboard): the path back to the list, number and status, the last change, the allowed
 * next actions, the key facts, any document-specific sections, and the tabs ending with the status history.
 */
export function DocumentCard({ crumb, title, status, actions, facts, children, tabs, history }: {
  crumb: { label: string; to: string }
  title: string
  status: { tone: StatusTone; label: string }
  actions?: ReactNode
  facts: Fact[]
  children?: ReactNode
  tabs: DocumentTab[]
  history: { entries: readonly HistoryEntry[]; label: (status: string) => string }
}) {
  const all: DocumentTab[] = [
    ...tabs,
    {
      value: 'history', label: 'Історія', count: history.entries.length,
      content: <div style={{ padding: 22 }}><HistoryTimeline entries={history.entries} label={history.label} userName={userName} /></div>,
    },
  ]
  const [tab, setTab] = useState<string | null>(all[0]!.value)
  const last = history.entries.at(-1)

  return (
    <Stack gap="lg">
      <Group gap={6} fz="sm">
        <Anchor component={Link} to={crumb.to} size="sm">{crumb.label}</Anchor>
        <Text size="sm" c="dimmed">/</Text>
        <Text size="sm" c="dimmed">{title}</Text>
      </Group>

      <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
        <Stack gap={8}>
          <Group gap="sm" wrap="wrap">
            <Title order={1}>{title}</Title>
            <StatusBadge tone={status.tone} label={status.label} />
          </Group>
          <Text size="md" c={tokens.color.ink2}>
            {last ? `Остання зміна: ${formatDateTime(last.at)} · ${userName(last.by)}` : 'Змін статусу ще не було'}
          </Text>
        </Stack>
        {actions && <Group gap="sm" wrap="wrap">{actions}</Group>}
      </Group>

      <FactGrid facts={facts} />

      {children}

      <Panel>
        <Tabs value={tab} onChange={setTab}>
          <Tabs.List px="md">
            {all.map((t) => (
              <Tabs.Tab key={t.value} value={t.value} rightSection={t.count !== undefined && <Badge variant="light" color="gray" size="sm">{t.count}</Badge>}>
                {t.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {all.map((t) => <Tabs.Panel key={t.value} value={t.value}>{t.content}</Tabs.Panel>)}
        </Tabs>
      </Panel>
    </Stack>
  )
}
