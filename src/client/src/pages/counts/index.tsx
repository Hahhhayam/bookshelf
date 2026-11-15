import { Alert, Anchor, Stack, Table } from '@mantine/core'
import { IconClipboardCheck, IconInfoCircle } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router'
import type { CountSession } from '@/entities/inventory-count'
import { useCan, useWorkingLocation } from '@/entities/viewer'
import { countStatus, StartCountButton, useCounts } from '@/features/ops-inventory-count'
import { useLocationName } from '@/features/ops-names'
import { formatDateTime, Perm, shortId } from '@/shared/lib'
import { EmptyState, PageHeader, Panel, QueryView, StatusBadge } from '@/shared/ui'

export default function CountsPage() {
  const location = useWorkingLocation()
  const navigate = useNavigate()
  const can = useCan()
  const counts = useCounts()
  const start = location && can(Perm.InventoryCountManage)
    ? <StartCountButton location={location} onStarted={(id) => navigate(`/staff/counts/${id}`)} />
    : null

  return (
    <Stack gap="lg">
      <PageHeader eyebrow={location?.name} title="Інвентаризація" actions={start} />
      <Alert color="gray" variant="light" icon={<IconInfoCircle size={18} />}>
        Показано інвентаризації, розпочаті в цьому браузері: система поки не повертає список інвентаризацій.
      </Alert>
      <Panel>
        <QueryView
          query={counts}
          isEmpty={(data) => data.length === 0}
          empty={<EmptyState icon={<IconClipboardCheck size={40} stroke={1.5} />} title="Інвентаризацій ще немає" text="Почніть перерахунок полиць цієї локації." actions={start} />}
        >
          {(data) => <CountTable counts={data} />}
        </QueryView>
      </Panel>
    </Stack>
  )
}

function CountTable({ counts }: { counts: CountSession[] }) {
  const locationName = useLocationName()
  return (
    <Table.ScrollContainer minWidth={600}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Номер</Table.Th>
            <Table.Th>Локація</Table.Th>
            <Table.Th>Розпочато</Table.Th>
            <Table.Th ta="right">Пораховано позицій</Table.Th>
            <Table.Th>Статус</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {counts.map((count) => (
            <Table.Tr key={count.id}>
              <Table.Td><Anchor component={Link} to={`/staff/counts/${count.id}`} ff="monospace" fw={600}>{shortId(count.id)}</Anchor></Table.Td>
              <Table.Td>{locationName(count.location)}</Table.Td>
              <Table.Td>{formatDateTime(count.startedAt)}</Table.Td>
              <Table.Td ta="right">{Object.keys(count.counted).length}</Table.Td>
              <Table.Td><StatusBadge {...countStatus[count.status]} /></Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
