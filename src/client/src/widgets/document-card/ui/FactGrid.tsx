import { Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { tokens } from '@/shared/config/tokens'

export interface Fact {
  label: string
  value: ReactNode
  mono?: boolean
}

/** The key facts of a document in a grid that reflows from six columns down to one on a phone. */
export function FactGrid({ facts }: { facts: Fact[] }) {
  return (
    <div
      style={{
        background: tokens.color.surface, border: `1px solid ${tokens.color.line}`, padding: '20px 24px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px 28px',
      }}
    >
      {facts.map((fact) => (
        <Stack key={fact.label} gap={4}>
          <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: '.02em' }}>{fact.label}</Text>
          <Text size="md" fw={fact.mono ? 400 : 600} ff={fact.mono ? 'monospace' : undefined} component="div">{fact.value}</Text>
        </Stack>
      ))}
    </div>
  )
}
