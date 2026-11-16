import { Group, Stack, Text } from '@mantine/core'
import { forwardRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { tokens } from '@/shared/config/tokens'
import { Key } from './Key'

/** A start-page tile (ShellCashier artboard); the primary one is plum and opens with Enter. */
export const HomeTile = forwardRef<HTMLAnchorElement, {
  to: string
  icon: ReactNode
  title: string
  text: string
  primary?: boolean
  onClick?: () => void
}>(function HomeTile({ to, icon, title, text, primary, onClick }, ref) {
  return (
    <Link ref={ref} to={to} onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24, minHeight: 168, padding: 24,
      textDecoration: 'none', boxSizing: 'border-box',
      background: primary ? tokens.color.accent : tokens.color.surface,
      color: primary ? '#FFFFFF' : tokens.color.ink,
      border: primary ? 0 : `1px solid ${tokens.color.line}`,
    }}>
      <span style={{ color: primary ? '#FFFFFF' : tokens.color.accent }}>{icon}</span>
      <Group justify="space-between" align="flex-end" wrap="nowrap">
        <Stack gap={4}>
          <Text fz={primary ? 22 : 20} fw={700}>{title}</Text>
          <Text fz={14} c={primary ? '#E6D6EB' : tokens.color.ink2}>{text}</Text>
        </Stack>
        {primary && <Key inverted>Enter</Key>}
      </Group>
    </Link>
  )
})
