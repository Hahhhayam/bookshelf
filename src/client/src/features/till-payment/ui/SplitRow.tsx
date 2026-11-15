import { Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { tokens } from '@/shared/config/tokens'

/** One method of the split dialog: icon, name with a hint, and its amount field (TillPay artboard). */
export function SplitRow({ icon, title, hint, field, last }: {
  icon: ReactNode
  title: string
  hint: ReactNode
  field: ReactNode
  last?: boolean
}) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '40px minmax(0,1fr) 168px', gap: 14, alignItems: 'center',
      padding: '14px 0', borderBottom: last ? 0 : `1px solid ${tokens.color.sunk}`,
    }}>
      <span style={{
        width: 40, height: 40, background: tokens.color.paper, color: tokens.color.accent,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</span>
      <Stack gap={3}>
        <Text fz={15} fw={700}>{title}</Text>
        <div style={{ fontSize: 13, color: tokens.color.ink2 }}>{hint}</div>
      </Stack>
      {field}
    </div>
  )
}
