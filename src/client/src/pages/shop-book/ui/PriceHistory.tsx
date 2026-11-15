import { Group, Stack, Text, Title } from '@mantine/core'
import { usePriceHistory, type PricePoint } from '@/entities/book'
import { tokens } from '@/shared/config/tokens'
import { formatMoney } from '@/shared/lib'
import { QueryView } from '@/shared/ui'
import { PriceHistoryChart } from './PriceHistoryChart'

export function PriceHistory({ bookId }: { bookId: string }) {
  const prices = usePriceHistory(bookId)
  return (
    <Stack gap="sm" component="section" style={{ flex: 1, minWidth: 0 }}>
      <Group justify="space-between" align="baseline">
        <Title order={2} fz={18}>Історія ціни</Title>
        <Text size="sm" c={tokens.color.ink2}>за весь час</Text>
      </Group>
      <QueryView query={prices} skeletonRows={4} isEmpty={(points) => points.length === 0}
        empty={<Text c="dimmed">Ціна не змінювалась.</Text>}>
        {(points) => <ChartWithNote points={points} />}
      </QueryView>
    </Stack>
  )
}

function ChartWithNote({ points }: { points: PricePoint[] }) {
  const lowest = points.reduce((min, p) => (p.price.amount < min.price.amount ? p : min))
  return (
    <>
      <PriceHistoryChart points={points} />
      <Text size="sm" c={tokens.color.ink2}>Найнижча ціна за весь час — {formatMoney(lowest.price)}.</Text>
    </>
  )
}
