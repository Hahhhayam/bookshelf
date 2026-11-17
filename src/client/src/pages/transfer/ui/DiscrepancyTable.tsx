import { Autocomplete, Stack, Table, Text } from '@mantine/core'
import { useBookTitles } from '@/entities/book'
import { useUserNames } from '@/entities/reference'
import { discrepancyReasons, type TransferDiscrepancy } from '@/entities/transfer'
import { formatDateTime } from '@/shared/lib'
import { DifferenceText, StatusBadge } from '@/shared/ui'

/** Expected against actual per book; an open line takes its reason here, a closed one shows who closed it and why. */
export function DiscrepancyTable({ discrepancies, editable, reasons, onReason }: {
  discrepancies: TransferDiscrepancy[]
  editable: boolean
  reasons: Record<string, string>
  onReason: (id: string, reason: string) => void
}) {
  const title = useBookTitles(discrepancies.map((d) => d.book))
  const userName = useUserNames()
  return (
    <Table.ScrollContainer minWidth={720}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Книга</Table.Th>
            <Table.Th ta="right">Очікувалось</Table.Th>
            <Table.Th ta="right">Фактично</Table.Th>
            <Table.Th ta="right">Різниця</Table.Th>
            <Table.Th w={260}>Причина</Table.Th>
            <Table.Th>Стан</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {discrepancies.map((d) => (
            <Table.Tr key={d.id}>
              <Table.Td><Text fw={600} size="md">{title(d.book)}</Text></Table.Td>
              <Table.Td ta="right">{d.expected}</Table.Td>
              <Table.Td ta="right">{d.actual}</Table.Td>
              <Table.Td ta="right"><DifferenceText value={d.actual - d.expected} /></Table.Td>
              <Table.Td>
                {d.isResolved ? (
                  <Stack gap={0}>
                    <Text size="sm">{d.reason}</Text>
                    {d.resolvedAt && (
                      <Text size="xs" c="dimmed">{formatDateTime(d.resolvedAt)} · {d.resolvedBy ? userName(d.resolvedBy) : '—'}</Text>
                    )}
                  </Stack>
                ) : editable ? (
                  <Autocomplete
                    aria-label={`Причина розбіжності, ${title(d.book)}`} placeholder="Оберіть причину…"
                    data={discrepancyReasons} value={reasons[d.id] ?? ''} onChange={(value) => onReason(d.id, value)}
                  />
                ) : <Text size="sm" c="dimmed">—</Text>}
              </Table.Td>
              <Table.Td>
                <StatusBadge tone={d.isResolved ? 'done' : 'problem'} label={d.isResolved ? 'Закрита' : 'Відкрита'} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
