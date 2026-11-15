import { Group, Stack, Table, Text, Title } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useBookTitles } from '@/entities/book'
import type { TransferCard } from '@/entities/transfer'
import { DifferenceText } from '@/features/ops-difference'
import { statusTone, tokens } from '@/shared/config/tokens'
import { StatusBadge } from '@/shared/ui'

/**
 * Discrepancies found at receiving, expected against actual. The API cannot resolve them yet (GAP-31), so the
 * design's reasons and "Підтвердити розбіжності" are not offered.
 */
export function DiscrepancyPanel({ transfer }: { transfer: TransferCard }) {
  const title = useBookTitles(transfer.discrepancies.map((d) => d.book))
  const open = transfer.discrepancies.filter((d) => !d.isResolved)
  const delta = transfer.discrepancies.reduce((sum, d) => sum + d.actual - d.expected, 0)
  const shipped = transfer.lines.reduce((sum, line) => sum + line.shipped, 0)
  const received = transfer.lines.reduce((sum, line) => sum + (line.received ?? 0), 0)
  const tone = open.length > 0 ? statusTone.problem : statusTone.done

  return (
    <section style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}`, boxShadow: `inset 0 3px 0 ${tone.dot}` }}>
      <Group gap="sm" align="flex-start" wrap="nowrap" px={22} pt={18} pb={12}>
        <IconAlertTriangle size={22} stroke={1.75} color={tone.dot} style={{ flex: 'none' }} />
        <Stack gap={2}>
          <Title order={2} fz={18}>
            Розбіжності при прийманні · {transfer.discrepancies.length} поз., {delta > 0 ? `+${delta}` : `−${-delta}`} од.
          </Title>
          <Text size="md" c={tokens.color.ink2}>
            Прийнято {received} з {shipped}. {open.length > 0 ? `Відкритих розбіжностей: ${open.length}.` : 'Усі розбіжності закрито.'}
          </Text>
        </Stack>
      </Group>
      <Table.ScrollContainer minWidth={560}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Книга</Table.Th>
              <Table.Th ta="right">Очікувалось</Table.Th>
              <Table.Th ta="right">Фактично</Table.Th>
              <Table.Th ta="right">Різниця</Table.Th>
              <Table.Th>Стан</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {transfer.discrepancies.map((d) => (
              <Table.Tr key={d.id}>
                <Table.Td><Text fw={600} size="md">{title(d.book)}</Text></Table.Td>
                <Table.Td ta="right">{d.expected}</Table.Td>
                <Table.Td ta="right">{d.actual}</Table.Td>
                <Table.Td ta="right"><DifferenceText value={d.actual - d.expected} /></Table.Td>
                <Table.Td>
                  <StatusBadge tone={d.isResolved ? 'done' : 'problem'} label={d.isResolved ? 'Закрита' : 'Відкрита'} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </section>
  )
}
