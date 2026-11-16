import { Anchor, Group, Stack, Table, Text, VisuallyHidden } from '@mantine/core'
import { IconAlertTriangle, IconArrowDownLeft, IconArrowUpRight } from '@tabler/icons-react'
import { Link } from 'react-router'
import { locationNames, userNames } from '@/entities/reference'
import { transferBadge, type TransferSummary } from '@/entities/transfer'
import { useViewer } from '@/entities/viewer'
import { statusTone, tokens } from '@/shared/config/tokens'
import { formatAgo, shortId } from '@/shared/lib'
import { Initials, StatusBadge } from '@/shared/ui'

export function TransferTable({ transfers, location }: { transfers: TransferSummary[]; location: string }) {
  const viewer = useViewer().data
  const locationName = locationNames(viewer?.locations)
  const userName = userNames(viewer)
  return (
    <Table.ScrollContainer minWidth={720}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}><VisuallyHidden>Проблема</VisuallyHidden></Table.Th>
            <Table.Th>Номер</Table.Th>
            <Table.Th>Звідки / куди</Table.Th>
            <Table.Th>Статус</Table.Th>
            <Table.Th>Остання зміна</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {transfers.map((transfer) => {
            const incoming = transfer.to === location
            return (
              <Table.Tr key={transfer.id} style={transfer.hasOpenDiscrepancies ? { background: statusTone.problem.bg } : undefined}>
                <Table.Td>
                  {transfer.hasOpenDiscrepancies && (
                    <IconAlertTriangle size={18} stroke={1.75} color={statusTone.problem.dot} aria-label="Відкрита розбіжність" />
                  )}
                </Table.Td>
                <Table.Td>
                  <Anchor component={Link} to={`/staff/transfers/${transfer.id}`} ff="monospace" fw={600}>{shortId(transfer.id)}</Anchor>
                </Table.Td>
                <Table.Td>
                  <Group gap={8} wrap="nowrap">
                    {incoming ? <IconArrowDownLeft size={16} stroke={1.75} /> : <IconArrowUpRight size={16} stroke={1.75} />}
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">{incoming ? 'Вхідне з' : 'Вихідне до'}</Text>
                      <Text size="md">{locationName(incoming ? transfer.from : transfer.to)}</Text>
                    </Stack>
                  </Group>
                </Table.Td>
                <Table.Td><StatusBadge {...transferBadge(transfer.status, transfer.hasOpenDiscrepancies)} /></Table.Td>
                <Table.Td>
                  {transfer.lastChangedBy ? (
                    <Group gap={8} wrap="nowrap">
                      <Initials name={userName(transfer.lastChangedBy)} />
                      <Stack gap={0}>
                        <Text size="md">{formatAgo(transfer.lastChangedAt)}</Text>
                        <Text size="xs" c={tokens.color.ink3}>{userName(transfer.lastChangedBy)}</Text>
                      </Stack>
                    </Group>
                  ) : formatAgo(transfer.lastChangedAt)}
                </Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
