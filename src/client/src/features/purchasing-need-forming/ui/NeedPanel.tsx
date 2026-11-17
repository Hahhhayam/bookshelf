import { Button, Group, Stack, Table, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import type { MissingBookRequest } from '@/entities/purchase-order'
import { tokens } from '@/shared/config/tokens'
import { formatDate } from '@/shared/lib'
import { Panel, QueryView } from '@/shared/ui'
import { useNeed, type NeedLine } from '../model/useNeed'

/** What to order for the location: low stock becomes order lines in one click, missing books are listed beside it. */
export function NeedPanel({ location, locationName, added, onAdd }: {
  location: string
  locationName: string
  added: readonly string[]
  onAdd: (lines: NeedLine[]) => void
}) {
  const need = useNeed(location)
  const notAdded = need.lines.filter((line) => !added.includes(line.book))
  return (
    <Panel
      title={`Потреба · ${locationName}`}
      extra={notAdded.length > 0 && (
        <Button variant="default" size="xs" disabled={need.cardsPending} onClick={() => onAdd(notAdded)}>Додати всі</Button>
      )}
    >
      <Stack gap={0}>
        <QueryView query={need.stock} isEmpty={() => need.lines.length === 0}
          empty={<Text c="dimmed" size="sm" p="md">Усі книги цієї локації вище мінімального залишку.</Text>}>
          {() => <LowStockTable lines={need.lines} added={added} disabled={need.cardsPending} onAdd={onAdd} />}
        </QueryView>
        <QueryView query={need.missing} skeletonRows={2}>
          {(data) => data.length > 0 && <MissingBooks requests={data} />}
        </QueryView>
      </Stack>
    </Panel>
  )
}

function LowStockTable({ lines, added, disabled, onAdd }: {
  lines: NeedLine[]
  added: readonly string[]
  disabled: boolean
  onAdd: (lines: NeedLine[]) => void
}) {
  return (
    <Table.ScrollContainer minWidth={480}>
      <Table verticalSpacing={8} horizontalSpacing={12}>
        <Table.Thead>
          <Table.Tr><Table.Th>Нижче мінімуму</Table.Th><Table.Th ta="right">Дозамовити</Table.Th><Table.Th w={120} /></Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lines.map((line) => (
            <Table.Tr key={line.book}>
              <Table.Td><Text fw={600} size="sm">{line.title}</Text></Table.Td>
              <Table.Td ta="right">{line.quantity}</Table.Td>
              <Table.Td ta="right">
                {added.includes(line.book)
                  ? <Text size="sm" c="dimmed">у замовленні</Text>
                  : <Button size="xs" variant="subtle" disabled={disabled} leftSection={<IconPlus size={14} />} onClick={() => onAdd([line])}>Додати</Button>}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function MissingBooks({ requests }: { requests: MissingBookRequest[] }) {
  return (
    <Stack gap={6} p="md" style={{ borderTop: `1px solid ${tokens.color.line}` }}>
      <Text size="sm" fw={600}>Запити на відсутні книги · {requests.length}</Text>
      <Text size="xs" c="dimmed">Цих книг немає в каталозі: додайте книгу в каталог, щоб замовити її.</Text>
      {requests.map((request) => (
        <Group key={request.id} justify="space-between" gap="sm" wrap="nowrap">
          <Text size="sm">{request.title}{request.author && <Text span c="dimmed" size="sm"> · {request.author}</Text>}</Text>
          <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
            запитів: {request.demand} · з {formatDate(request.recordedAt)}
          </Text>
        </Group>
      ))}
    </Stack>
  )
}
