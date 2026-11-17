import { Table, Text } from '@mantine/core'
import { useBookTitles } from '@/entities/book'
import type { GoodsReceiptCard } from '@/entities/purchase-order'

/** Every book of the receipt; an unplanned delivery has no ordered quantities. */
export function ReceiptLines({ lines, planned }: { lines: GoodsReceiptCard['lines']; planned: boolean }) {
  const title = useBookTitles(lines.map((line) => line.book))
  return (
    <Table.ScrollContainer minWidth={480}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Книга</Table.Th>
            {planned && <Table.Th ta="right">Очікувалось</Table.Th>}
            <Table.Th ta="right">Прийнято</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lines.map((line) => (
            <Table.Tr key={line.book}>
              <Table.Td><Text fw={600} size="md">{title(line.book)}</Text></Table.Td>
              {planned && <Table.Td ta="right">{line.ordered}</Table.Td>}
              <Table.Td ta="right">{line.received}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
