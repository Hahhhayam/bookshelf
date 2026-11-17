import { Chip, Group, SegmentedControl, Select, TextInput } from '@mantine/core'
import { IconClock, IconSearch } from '@tabler/icons-react'
import { orderStatus, type OrderStatus } from '@/entities/order'
import type { BoardFilters, BoardView } from '../model/filters'


const statusOptions = [
  { value: '', label: 'Відкриті' },
  ...(Object.keys(orderStatus) as OrderStatus[]).map((status) => ({ value: status, label: orderStatus[status].label })),
]

export function BoardToolbar({ filters, lateCount, onChange }: {
  filters: BoardFilters
  lateCount: number
  onChange: (next: BoardFilters) => void
}) {
  return (
    <Group gap={10} wrap="wrap">
      <SegmentedControl
        value={filters.view}
        onChange={(view) => onChange({ ...filters, view: view as BoardView, status: view === 'board' ? null : filters.status })}
        data={[{ value: 'board', label: 'Дошка' }, { value: 'list', label: 'Список' }]}
      />
      <TextInput
        w={340} maw="100%" placeholder="Номер, код отримання або клієнт" aria-label="Пошук замовлення"
        leftSection={<IconSearch size={16} stroke={1.75} />}
        value={filters.search} onChange={(event) => onChange({ ...filters, search: event.currentTarget.value })}
      />
      {filters.view === 'list' && (
        <Select
          w={200} aria-label="Статус" data={statusOptions} allowDeselect={false}
          value={filters.status ?? ''} onChange={(value) => onChange({ ...filters, status: (value || null) as OrderStatus | null })}
        />
      )}
      <Chip checked={filters.lateOnly} onChange={(lateOnly) => onChange({ ...filters, lateOnly })} color="yellow" variant="outline">
        <Group gap={6} wrap="nowrap"><IconClock size={14} stroke={1.75} />Чекають задовго · {lateCount}</Group>
      </Chip>
    </Group>
  )
}
