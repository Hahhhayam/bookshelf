import { Group, Stack, Text } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { statusTone, tokens } from '@/shared/config/tokens'

export type ScanMessage =
  | { tone: 'ok'; text: ReactNode }
  | { tone: 'error'; title: string; text: ReactNode; extra?: ReactNode }

/** The line under the scan field: green «Додано: …» or a red refusal with what to do next. */
export function ScanStatus({ message }: { message: ScanMessage | null }) {
  if (!message) return <div style={{ height: 36, flex: 'none' }} />
  if (message.tone === 'ok') {
    return (
      <Group role="status" gap={10} h={36} px={14} wrap="nowrap" style={{ flex: 'none', background: statusTone.ready.bg, color: statusTone.ready.text }}>
        <IconCheck size={18} stroke={1.75} />
        <Text fz={14} fw={500} truncate>{message.text}</Text>
      </Group>
    )
  }
  return (
    <Stack role="alert" gap={6} p="md" style={{ flex: 'none', background: tokens.color.surface, boxShadow: `inset 3px 0 0 ${tokens.color.danger}` }}>
      <Text fz={16} fw={600} c={tokens.color.danger}>{message.title}</Text>
      <Text fz={14}>{message.text}</Text>
      {message.extra && <Text fz={13} c={tokens.color.ink2}>{message.extra}</Text>}
    </Stack>
  )
}
