import { Table, Text } from '@mantine/core'
import { useBookTitles } from '@/entities/book'
import type { OrderCard } from '@/entities/order'
import { uah } from '@/shared/api'
import { MoneyText } from '@/shared/ui'

export function OrderLines({ order }: { order: OrderCard }) {
  const title = useBookTitles(order.lines.map((line) => line.book))
  return (
    <Table.ScrollContainer minWidth={560}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Книга</Table.Th>
            <Table.Th ta="right">Кількість</Table.Th>
            <Table.Th ta="right">Ціна</Table.Th>
            <Table.Th ta="right">Сума</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {order.lines.map((line) => (
            <Table.Tr key={line.book}>
              <Table.Td><Text fw={600} size="md">{title(line.book)}</Text></Table.Td>
              <Table.Td ta="right">{line.quantity}</Table.Td>
              <Table.Td ta="right"><MoneyText value={line.unitPrice} /></Table.Td>
              <Table.Td ta="right">
                <MoneyText value={{ ...line.unitPrice, amount: line.unitPrice.amount * line.quantity }} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Th colSpan={3} ta="right">Разом</Table.Th>
            <Table.Th ta="right"><MoneyText value={order.total ?? uah(0)} variant="strong" /></Table.Th>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    </Table.ScrollContainer>
  )
}
