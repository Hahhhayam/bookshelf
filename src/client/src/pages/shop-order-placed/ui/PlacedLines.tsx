import { Group, Stack, Text, Title } from '@mantine/core'
import type { PlacedOrderSummary } from '@/features/shop-place-order'
import { tokens } from '@/shared/config/tokens'
import { MoneyText } from '@/shared/ui'

/** «Що в замовленні»: the cart as it was sent; the total is the client's sum of catalog prices (GAP-25). */
export function PlacedLines({ summary }: { summary: PlacedOrderSummary }) {
  return (
    <Stack component="aside" gap={4} p="lg" w={{ base: '100%', md: 360 }}
      style={{ flex: 'none', background: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}>
      <Title order={2} fz={17} mb="xs">Що в замовленні</Title>
      {summary.lines.map((line) => (
        <Group key={line.book} justify="space-between" wrap="nowrap" py={6} gap="sm">
          <Text fz={15}>{line.title}{line.quantity > 1 ? ` × ${line.quantity}` : ''}</Text>
          <MoneyText value={{ ...line.price, amount: line.price.amount * line.quantity }} />
        </Group>
      ))}
      <Group justify="space-between" align="baseline" mt="xs" pt="sm" style={{ borderTop: `2px solid ${tokens.color.ink}` }}>
        <Text fw={600}>Сплатити на місці</Text>
        <MoneyText value={summary.total} variant="strong" size={24} />
      </Group>
    </Stack>
  )
}
