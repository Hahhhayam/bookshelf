import { Select, Stack } from '@mantine/core'
import { toOptions, useReferenceList } from '@/entities/reference'

export interface Facets {
  category: string | null
  publisher: string | null
}

/** FR-03: narrowing the search by category and publisher. */
export function FacetFilter({ value, onChange }: { value: Facets; onChange: (next: Facets) => void }) {
  const categories = useReferenceList('categories')
  const publishers = useReferenceList('publishers', { active: true })
  return (
    <Stack component="section" aria-label="Категорія і видавництво" gap="sm" w={{ base: '100%', md: 260 }} style={{ flex: 'none' }}>
      <Select label="Категорія" placeholder="Усі категорії" clearable searchable
        data={toOptions(categories.data, value.category ? [value.category] : [])}
        value={value.category} onChange={(category) => onChange({ ...value, category })} />
      <Select label="Видавництво" placeholder="Усі видавництва" clearable searchable
        data={toOptions(publishers.data, value.publisher ? [value.publisher] : [])}
        value={value.publisher} onChange={(publisher) => onChange({ ...value, publisher })} />
    </Stack>
  )
}
