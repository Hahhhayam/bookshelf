import { Checkbox, Group, SegmentedControl, Select } from '@mantine/core'
import { transferStatus, type TransferStatus } from '@/entities/transfer'

export type Direction = 'all' | 'in' | 'out'

export interface TransferFilterState {
  status: TransferStatus | null
  direction: Direction
  problemsOnly: boolean
}

export const initialFilters: TransferFilterState = { status: null, direction: 'all', problemsOnly: false }

const statusOptions = [
  { value: '', label: 'Статус: відкриті' },
  ...(Object.keys(transferStatus) as TransferStatus[]).map((status) => ({ value: status, label: `Статус: ${transferStatus[status].label.toLowerCase()}` })),
]

export function TransferFilters({ value, onChange }: { value: TransferFilterState; onChange: (next: TransferFilterState) => void }) {
  return (
    <Group gap={10} wrap="wrap">
      <SegmentedControl
        value={value.direction}
        onChange={(direction) => onChange({ ...value, direction: direction as Direction })}
        data={[{ value: 'all', label: 'Усі' }, { value: 'in', label: 'Вхідні' }, { value: 'out', label: 'Вихідні' }]}
      />
      <Select
        w={220} aria-label="Статус" data={statusOptions} allowDeselect={false}
        value={value.status ?? ''} onChange={(status) => onChange({ ...value, status: (status || null) as TransferStatus | null })}
      />
      <Checkbox
        label="Лише з проблемами" checked={value.problemsOnly}
        onChange={(event) => onChange({ ...value, problemsOnly: event.currentTarget.checked })}
      />
    </Group>
  )
}
