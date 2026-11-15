import { Group, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import type { AvailabilityTone } from '@/features/shop-my-store'
import { statusTone } from '@/shared/config/tokens'

const colour: Record<AvailabilityTone, { text: string; dot: string }> = {
  ok: { text: statusTone.ready.text, dot: statusTone.ready.dot },
  elsewhere: { text: statusTone.attention.text, dot: statusTone.attention.dot },
  none: { text: statusTone.draft.text, dot: statusTone.draft.dot },
}

/** «● Сьогодні»: a square dot and a word, so availability never rests on colour alone. */
export function AvailabilityNote({ tone, children, size = 13 }: { tone: AvailabilityTone; children: ReactNode; size?: number }) {
  const c = colour[tone]
  return (
    <Group gap={6} wrap="nowrap" component="span" style={{ color: c.text }}>
      <span aria-hidden="true" style={{ width: 8, height: 8, flex: 'none', background: c.dot }} />
      <Text component="span" fz={size} fw={600} c="inherit">{children}</Text>
    </Group>
  )
}
