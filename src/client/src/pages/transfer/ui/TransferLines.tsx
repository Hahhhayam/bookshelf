import { Table, Text } from '@mantine/core'
import { useBookTitles } from '@/entities/book'
import type { TransferCard } from '@/entities/transfer'
import { DifferenceText, differenceRowStyle } from '@/shared/ui'

const diffOf = (line: TransferCard['lines'][number]) => (line.received === null ? null : line.received - line.shipped)

/** Lines with a difference come first, as on the Document artboard. */
export function TransferLines({ transfer }: { transfer: TransferCard }) {
  const title = useBookTitles(transfer.lines.map((line) => line.book))
  const lines = [...transfer.lines].sort((a, b) => Math.abs(diffOf(b) ?? 0) - Math.abs(diffOf(a) ?? 0))
  return (
    <Table.ScrollContainer minWidth={560}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Книга</Table.Th>
            <Table.Th ta="right">Відправлено</Table.Th>
            <Table.Th ta="right">Фактично</Table.Th>
            <Table.Th ta="right">Різниця</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lines.map((line) => (
            <Table.Tr key={line.book} style={differenceRowStyle(diffOf(line))}>
              <Table.Td><Text fw={600} size="md">{title(line.book)}</Text></Table.Td>
              <Table.Td ta="right">{line.shipped}</Table.Td>
              <Table.Td ta="right">{line.received ?? '—'}</Table.Td>
              <Table.Td ta="right"><DifferenceText value={diffOf(line)} /></Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
