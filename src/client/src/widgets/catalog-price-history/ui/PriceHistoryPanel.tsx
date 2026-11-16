import { Stack, Table, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { usePriceHistory, type PricePoint } from '@/entities/book'
import { formatDateTime, formatMoney } from '@/shared/lib'
import { MoneyText, Panel, QueryView } from '@/shared/ui'

/** The book's current price with the change action, and the append-only history under it. */
export function PriceHistoryPanel({ bookId, action }: { bookId: string; action?: ReactNode }) {
  const history = usePriceHistory(bookId)
  return (
    <Panel title="Ціна та історія" extra={action}>
      <QueryView query={history} skeletonRows={3} isEmpty={(points) => points.length === 0}
        empty={<Text c="dimmed" size="sm" p="md">Історії цін ще немає.</Text>}>
        {(points) => <History points={sortByDate(points)} />}
      </QueryView>
    </Panel>
  )
}

function sortByDate(points: readonly PricePoint[]) {
  return [...points].sort((a, b) => a.validFrom.localeCompare(b.validFrom))
}

function History({ points }: { points: PricePoint[] }) {
  const current = points[points.length - 1]!
  return (
    <Stack gap="sm" p="md">
      <Text size="sm" c="dimmed">Зараз <MoneyText value={current.price} variant="strong" size={18} /></Text>
      <Table.ScrollContainer minWidth={320}>
        <Table striped={false} verticalSpacing={6}>
          <Table.Thead><Table.Tr><Table.Th>Діє з</Table.Th><Table.Th ta="right">Ціна</Table.Th><Table.Th ta="right">Зміна</Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>
            {[...points].reverse().map((point, i, all) => (
              <Table.Tr key={point.validFrom}>
                <Table.Td>{formatDateTime(point.validFrom)}</Table.Td>
                <Table.Td ta="right"><MoneyText value={point.price} /></Table.Td>
                <Table.Td ta="right"><Change from={all[i + 1]} to={point} /></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  )
}

function Change({ from, to }: { from: PricePoint | undefined; to: PricePoint }) {
  if (!from) return <Text size="sm" c="dimmed">початкова</Text>
  const delta = to.price.amount - from.price.amount
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : ''
  return <Text size="sm">{sign}{formatMoney({ amount: Math.abs(delta), currency: to.price.currency })}</Text>
}
