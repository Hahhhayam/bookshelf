import { Group, Stack, Text, Title } from '@mantine/core'
import { useBookTitles } from '@/entities/book'
import type { TrackedOrder } from '@/entities/order'
import { tokens } from '@/shared/config/tokens'
import { MoneyText } from '@/shared/ui'

/** «Що в замовленні»: the lines at the prices the order fixed, and the order's total. */
export function PlacedLines({ order }: { order: TrackedOrder }) {
  const titleOf = useBookTitles(order.lines.map((line) => line.book))
  return (
    <Stack component="aside" gap={4} p="lg" w={{ base: '100%', md: 360 }}
      style={{ flex: 'none', background: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}>
      <Title order={2} fz={17} mb="xs">Що в замовленні</Title>
      {order.lines.map((line) => (
        <Group key={line.book} justify="space-between" wrap="nowrap" py={6} gap="sm">
          <Text fz={15}>{titleOf(line.book)}{line.quantity > 1 ? ` × ${line.quantity}` : ''}</Text>
          <MoneyText value={{ ...line.unitPrice, amount: line.unitPrice.amount * line.quantity }} />
        </Group>
      ))}
      <Group justify="space-between" align="baseline" mt="xs" pt="sm" style={{ borderTop: `2px solid ${tokens.color.ink}` }}>
        <Text fw={600}>Разом</Text>
        <MoneyText value={order.total} variant="strong" size={24} />
      </Group>
    </Stack>
  )
}
