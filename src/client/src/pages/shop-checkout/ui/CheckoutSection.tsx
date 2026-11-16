import { Group, Stack, Title } from '@mantine/core'
import type { ReactNode } from 'react'
import { tokens } from '@/shared/config/tokens'

/** A numbered checkout step: «1 Покупець», «2 Отримання». */
export function CheckoutSection({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <Stack component="section" gap="md" p={{ base: 'md', sm: 'lg' }}
      style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}>
      <Group gap="sm">
        <span aria-hidden="true" style={{
          width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: tokens.color.ink, color: tokens.color.surface, fontWeight: 700, fontSize: 14,
        }}>{step}</span>
        <Title order={2} fz={20}>{title}</Title>
      </Group>
      {children}
    </Stack>
  )
}
