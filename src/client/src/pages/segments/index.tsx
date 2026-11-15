import { Alert, Button, Grid, Stack, Table, Text } from '@mantine/core'
import { IconInfoCircle, IconPencil, IconUsersGroup } from '@tabler/icons-react'
import { useState } from 'react'
import { useReferenceList, type Segment } from '@/entities/reference'
import { SegmentForm, useSaveSegment } from '@/features/crm-segment-form'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { EditSegmentDialog } from './ui/EditSegmentDialog'

/** Customer segments for targeted promotions (FR-14); listed from what was created here until the API lists them (GAP-12). */
export default function SegmentsPage() {
  const segments = useReferenceList('segments')
  const create = useSaveSegment()
  const [editing, setEditing] = useState<Segment | null>(null)

  return (
    <Stack gap="lg">
      <PageHeader eyebrow="Клієнти" title="Сегменти" />
      <Alert variant="light" color="gray" icon={<IconInfoCircle size={18} />}>
        Сервер поки не віддає список сегментів, тож тут видно лише сегменти, створені в цьому браузері.
      </Alert>
      <Grid gap="lg" align="flex-start">
        <Grid.Col span={{ base: 12, md: 4 }}><Panel title="Новий сегмент" padding={16}>
          <SegmentForm submitLabel="Створити сегмент" submitting={create.isPending} error={create.error ?? undefined}
            onSubmit={(values) => create.mutateAsync(values)} />
        </Panel></Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}><Panel>
          <QueryView query={segments} isEmpty={(rows) => rows.length === 0}
            empty={<EmptyState icon={<IconUsersGroup size={40} stroke={1.5} />} title="Сегментів ще немає"
              text="Створіть перший сегмент — потім його можна призначати клієнтам у їхній картці." />}>
            {(rows) => <SegmentTable rows={rows} onEdit={setEditing} />}
          </QueryView>
        </Panel></Grid.Col>
      </Grid>
      {editing && <EditSegmentDialog segment={editing} onClose={() => setEditing(null)} />}
    </Stack>
  )
}

function SegmentTable({ rows, onEdit }: { rows: Segment[]; onEdit: (segment: Segment) => void }) {
  return (
    <Table.ScrollContainer minWidth={420}>
      <Table verticalSpacing="sm">
        <Table.Thead><Table.Tr><Table.Th>Назва</Table.Th><Table.Th>Опис</Table.Th><Table.Th /></Table.Tr></Table.Thead>
        <Table.Tbody>
          {rows.map((segment) => (
            <Table.Tr key={segment.id}>
              <Table.Td><Text fw={600}>{segment.name}</Text></Table.Td>
              <Table.Td><Text size="sm" c="dimmed">{segment.description ?? '—'}</Text></Table.Td>
              <Table.Td ta="right">
                <Button variant="subtle" size="xs" leftSection={<IconPencil size={14} />} onClick={() => onEdit(segment)}>Змінити</Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
