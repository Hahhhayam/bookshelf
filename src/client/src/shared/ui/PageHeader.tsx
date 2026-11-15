import { Group, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'

/** Page title with an optional context line above it and the page's actions on the right. */
export function PageHeader({ eyebrow, title, actions, after }: {
  eyebrow?: ReactNode
  title: ReactNode
  actions?: ReactNode
  after?: ReactNode
}) {
  return (
    <Group justify="space-between" align="flex-end" gap="md" wrap="wrap">
      <Stack gap={4}>
        {eyebrow && <Text size="sm" c="dimmed">{eyebrow}</Text>}
        <Group gap="sm" align="center">
          <Title order={1}>{title}</Title>
          {after}
        </Group>
      </Stack>
      {actions && <Group gap="sm">{actions}</Group>}
    </Group>
  )
}
