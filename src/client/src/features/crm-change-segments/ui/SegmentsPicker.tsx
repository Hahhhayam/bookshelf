import { MultiSelect } from '@mantine/core'
import { referenceName, useReferenceList } from '@/entities/reference'

/** The remembered segments (GAP-12), plus any the customer already has that were never seen here. */
export function SegmentsPicker({ value, onChange, label = 'Сегменти' }: {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
}) {
  const segments = useReferenceList('segments')
  const known = (segments.data ?? []).map((s) => ({ value: s.id, label: s.name }))
  const unknown = value.filter((id) => !known.some((s) => s.value === id)).map((id) => ({ value: id, label: referenceName('segments', id) }))
  return (
    <MultiSelect label={label} searchable clearable data={[...known, ...unknown]} value={value} onChange={onChange}
      placeholder={known.length === 0 ? 'Спершу створіть сегменти' : 'Оберіть сегменти'} nothingFoundMessage="Немає такого сегмента" />
  )
}
