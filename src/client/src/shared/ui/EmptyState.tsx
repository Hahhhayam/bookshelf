import { Group, Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { tokens } from '@/shared/config/tokens'

/** An empty or nothing-found list: what happened, why, and what to do next. */
export function EmptyState({ icon, title, text, actions }: {
  icon?: ReactNode
  title: string
  text?: ReactNode
  actions?: ReactNode
}) {
  return (
    <Stack align="center" gap="sm" py={48} px="lg" style={{ textAlign: 'center' }}>
      {icon && <div style={{ color: tokens.color.accent2 }}>{icon}</div>}
      <Text fw={600} fz={18}>{title}</Text>
      {text && <Text size="md" c="dimmed" maw={360}>{text}</Text>}
      {actions && <Group gap="sm" mt={6}>{actions}</Group>}
    </Stack>
  )
}
