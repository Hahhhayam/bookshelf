import { Text } from '@mantine/core'
import { IconArrowDownRight, IconArrowRight, IconArrowUpRight } from '@tabler/icons-react'
import { tokens } from '@/shared/config/tokens'

const percent = new Intl.NumberFormat('uk-UA', { style: 'percent', maximumFractionDigits: 1 })

/** How a figure moved against the previous period of the same length (table 1.1, «порівняння періодів»). */
export function Trend({ current, previous, previousText }: { current: number; previous: number; previousText: string }) {
  if (previous === 0) {
    return <Text size="sm" c="dimmed">{current === 0 ? 'як і в попередньому періоді' : 'у попередньому періоді — 0'}</Text>
  }
  const change = (current - previous) / previous
  const Icon = change > 0 ? IconArrowUpRight : change < 0 ? IconArrowDownRight : IconArrowRight
  const color = change > 0 ? tokens.color.positive : change < 0 ? tokens.color.danger : tokens.color.ink3
  return (
    <Text size="sm" c="dimmed" title={`Попередній період: ${previousText}`}>
      <Text span fw={600} c={color} style={{ whiteSpace: 'nowrap' }}>
        <Icon size={14} stroke={2} style={{ verticalAlign: '-2px' }} /> {change > 0 ? '+' : ''}{percent.format(change)}
      </Text>
      {' '}до попереднього ({previousText})
    </Text>
  )
}
