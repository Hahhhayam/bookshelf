import { Group, Table, Text, Title } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useBookTitles } from '@/entities/book'
import type { GoodsReceiptCard } from '@/entities/purchase-order'
import { statusTone, tokens } from '@/shared/config/tokens'
import { DifferenceText } from '@/shared/ui'

/** The differences between ordered and received quantities, recorded separately from the lines (FR-12). */
export function ReceiptDiscrepancies({ discrepancies }: { discrepancies: GoodsReceiptCard['discrepancies'] }) {
  const title = useBookTitles(discrepancies.map((d) => d.book))
  const tone = statusTone.problem
  return (
    <section style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}`, boxShadow: `inset 0 3px 0 ${tone.dot}` }}>
      <Group gap="sm" wrap="nowrap" px={22} pt={18} pb={12}>
        <IconAlertTriangle size={22} stroke={1.75} color={tone.dot} style={{ flex: 'none' }} />
        <Title order={2} fz={18}>Розбіжності з замовленням · {discrepancies.length} поз.</Title>
      </Group>
      <Table.ScrollContainer minWidth={480}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Книга</Table.Th>
              <Table.Th ta="right">Очікувалось</Table.Th>
              <Table.Th ta="right">Прийнято</Table.Th>
              <Table.Th ta="right">Різниця</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {discrepancies.map((d) => (
              <Table.Tr key={d.id}>
                <Table.Td><Text fw={600} size="md">{title(d.book)}</Text></Table.Td>
                <Table.Td ta="right">{d.ordered}</Table.Td>
                <Table.Td ta="right">{d.received}</Table.Td>
                <Table.Td ta="right"><DifferenceText value={d.received - d.ordered} /></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </section>
  )
}
