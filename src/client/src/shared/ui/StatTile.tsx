import { Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { tokens } from '@/shared/config/tokens'

/** One headline figure of a dashboard. */
export function StatTile({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <Stack gap={6} p="md" style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}>
      <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: '.02em' }}>{label}</Text>
      <Text fz={28} fw={700} lh="36px">{value}</Text>
      {hint && <Text size="sm" c="dimmed">{hint}</Text>}
    </Stack>
  )
}
