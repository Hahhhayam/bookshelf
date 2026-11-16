import { Table, Text } from '@mantine/core'
import { useBookTitles } from '@/entities/book'
import type { PurchaseOrderCard } from '@/entities/purchase-order'
import { statusTone } from '@/shared/config/tokens'
import { MoneyText } from '@/shared/ui'

type Line = PurchaseOrderCard['lines'][number]

/** Ordered against received per book; a line still short after deliveries started is highlighted. */
export function OrderLinesTable({ order }: { order: PurchaseOrderCard }) {
  const title = useBookTitles(order.lines.map((line) => line.book))
  const deliveriesStarted = order.status === 'PartlyReceived' || order.status === 'Received'
  return (
    <Table.ScrollContainer minWidth={720}>
      <Table verticalSpacing={11} horizontalSpacing={12}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Книга</Table.Th>
            <Table.Th ta="right">Замовлено</Table.Th>
            <Table.Th ta="right">Отримано</Table.Th>
            <Table.Th ta="right">Ціна закупівлі</Table.Th>
            <Table.Th ta="right">Сума</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {order.lines.map((line) => (
            <LineRow key={line.book} line={line} title={title(line.book)} short={deliveriesStarted && line.received < line.ordered} />
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function LineRow({ line, title, short }: { line: Line; title: string; short: boolean }) {
  const sum = { amount: line.ordered * line.purchasePrice.amount, currency: line.purchasePrice.currency }
  return (
    <Table.Tr style={{ background: short ? statusTone.problem.row : undefined }}>
      <Table.Td><Text fw={600} size="sm">{title}</Text></Table.Td>
      <Table.Td ta="right">{line.ordered}</Table.Td>
      <Table.Td ta="right" style={{ color: short ? statusTone.problem.text : undefined, fontWeight: short ? 700 : undefined }}>
        {line.received}
      </Table.Td>
      <Table.Td ta="right"><MoneyText value={line.purchasePrice} /></Table.Td>
      <Table.Td ta="right"><MoneyText value={sum} variant="strong" /></Table.Td>
    </Table.Tr>
  )
}
