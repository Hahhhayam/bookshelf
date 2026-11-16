import { MultiSelect } from '@mantine/core'
import { toOptions, useReferenceList } from '@/entities/reference'

/** The remembered segments (GAP-12), plus any the customer already has that were never seen here. */
export function SegmentsPicker({ value, onChange, label = 'Сегменти' }: {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
}) {
  const segments = useReferenceList('segments')
  const known = segments.data ?? []
  return (
    <MultiSelect label={label} searchable clearable data={toOptions('segments', known, value)} value={value} onChange={onChange}
      placeholder={known.length === 0 ? 'Спершу створіть сегменти' : 'Оберіть сегменти'} nothingFoundMessage="Немає такого сегмента" />
  )
}
