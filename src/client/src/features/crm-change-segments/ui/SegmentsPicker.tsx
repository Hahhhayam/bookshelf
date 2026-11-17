import { MultiSelect } from '@mantine/core'
import { toOptions, useReferenceList } from '@/entities/reference'

/** The chain's segments, plus any the customer already has. */
export function SegmentsPicker({ value, onChange, label = 'Сегменти' }: {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
}) {
  const segments = useReferenceList('segments')
  const known = segments.data ?? []
  return (
    <MultiSelect label={label} searchable clearable data={toOptions(known, value)} value={value} onChange={onChange}
      placeholder={known.length === 0 ? 'Спершу створіть сегменти' : 'Оберіть сегменти'} nothingFoundMessage="Немає такого сегмента" />
  )
}
