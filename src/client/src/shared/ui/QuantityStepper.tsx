import { ActionIcon, Group, Text } from '@mantine/core'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { tokens } from '@/shared/config/tokens'

/** − 1 + : the quantity of one line. */
export function QuantityStepper({ value, onChange, min = 1, max }: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
}) {
  const border = `1px solid ${tokens.color.lineStrong}`
  return (
    <Group gap={0} wrap="nowrap">
      <ActionIcon variant="default" size={40} aria-label="Менше" disabled={value <= min} onClick={() => onChange(value - 1)}>
        <IconMinus size={16} stroke={1.75} />
      </ActionIcon>
      <Text component="span" w={44} h={40} fw={600} ta="center" lh="38px" aria-live="polite"
        style={{ borderTop: border, borderBottom: border, background: tokens.color.surface }}>
        {value}
      </Text>
      <ActionIcon variant="default" size={40} aria-label="Більше" disabled={max !== undefined && value >= max}
        onClick={() => onChange(value + 1)}>
        <IconPlus size={16} stroke={1.75} />
      </ActionIcon>
    </Group>
  )
}
