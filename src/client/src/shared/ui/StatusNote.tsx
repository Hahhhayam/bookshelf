import { Group, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { statusTone, type StatusTone } from '@/shared/config/tokens'

/** «● Сьогодні»: a square dot and a word in a status colour, for status text that is not a badge. */
export function StatusNote({ tone, children, size = 13 }: { tone: StatusTone; children: ReactNode; size?: number }) {
  const c = statusTone[tone]
  return (
    <Group gap={6} wrap="nowrap" component="span" style={{ color: c.text }}>
      <span aria-hidden="true" style={{ width: 8, height: 8, flex: 'none', background: c.dot }} />
      <Text component="span" fz={size} fw={600} c="inherit">{children}</Text>
    </Group>
  )
}
