import { Group, Text } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { formatNumber } from '@/shared/lib'
import { Panel, SimpleTable } from '@/shared/ui'
import { DrillLink } from './DrillLink'

export interface ShortageRow {
  key: string
  title: string
  location: string
  locationName: string
  onHand: number
  minimum: number
}

export function ShortagesTable({ rows, more, onLocation }: {
  rows: ShortageRow[]
  more: number
  onLocation: (location: string) => void
}) {
  return (
    <Panel
      title={<Group gap={8}><IconAlertTriangle size={18} stroke={1.75} />Закінчуються</Group>}
      extra={<Text size="sm" c="dimmed">залишок нижче мінімуму</Text>}
    >
      <SimpleTable
        empty="Усі залишки вище мінімуму"
        columns={[{ label: 'Книга' }, { label: 'Де' }, { label: 'Залишок', numeric: true }, { label: 'Мінімум', numeric: true }]}
        rows={rows.map((row) => ({
          key: row.key, cells: [row.title, <DrillLink key="l" onClick={() => onLocation(row.location)}>{row.locationName}</DrillLink>, formatNumber(row.onHand), formatNumber(row.minimum)],
        }))}
      />
      {more > 0 && <Text size="sm" c="dimmed" px="md" py="sm">і ще {formatNumber(more)} — повний список в експорті CSV</Text>}
    </Panel>
  )
}
