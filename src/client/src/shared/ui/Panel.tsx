import { Group, Title } from '@mantine/core'
import type { CSSProperties, ReactNode } from 'react'
import { tokens } from '@/shared/config/tokens'

/** The white bordered surface every card, table and form sits on. */
export function Panel({ title, extra, children, padding = 0, style }: {
  title?: ReactNode
  extra?: ReactNode
  children: ReactNode
  padding?: number
  style?: CSSProperties
}) {
  return (
    <section style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}`, ...style }}>
      {title && (
        <Group justify="space-between" px="md" py="sm" style={{ borderBottom: `1px solid ${tokens.color.line}` }}>
          <Title order={2} fz={17}>{title}</Title>
          {extra}
        </Group>
      )}
      <div style={{ padding }}>{children}</div>
    </section>
  )
}
