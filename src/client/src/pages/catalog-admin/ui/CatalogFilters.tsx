import { Button, Select, SimpleGrid, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useStores } from '@/entities/store'
import { isTooShort, searchHint } from '@/shared/config/search'
import { AuthorPicker, CategoryPicker, PublisherPicker } from '@/features/catalog-pickers'

export type StatusFilter = 'active' | 'all' | 'deactivated'

export interface CatalogFilter {
  text: string
  isbn: string
  category: string | null
  author: string | null
  publisher: string | null
  availableAt: string | null
  status: StatusFilter
}

export const noFilter: CatalogFilter = {
  text: '', isbn: '', category: null, author: null, publisher: null, availableAt: null, status: 'active',
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'active', label: 'На продажу' },
  { value: 'all', label: 'Усі, з деактивованими' },
  { value: 'deactivated', label: 'Лише деактивовані' },
]

export function hasFilter(filter: CatalogFilter) {
  return !!(filter.text.trim() || filter.isbn.trim() || filter.category || filter.author || filter.publisher ||
    filter.availableAt || filter.status !== 'active')
}

export function CatalogFilters({ value, onChange }: { value: CatalogFilter; onChange: (next: CatalogFilter) => void }) {
  const set = (patch: Partial<CatalogFilter>) => onChange({ ...value, ...patch })
  const stores = useStores().data ?? []
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="sm" style={{ alignItems: 'end' }}>
      <TextInput label="Назва або штрихкод" leftSection={<IconSearch size={16} stroke={1.75} />} value={value.text}
        description={isTooShort(value.text) ? searchHint : undefined}
        onChange={(e) => set({ text: e.currentTarget.value })} placeholder="Наприклад, Амадока" />
      <TextInput label="ISBN" value={value.isbn} onChange={(e) => set({ isbn: e.currentTarget.value })} placeholder="978-…" />
      <CategoryPicker value={value.category} onChange={(category) => set({ category })} clearable placeholder="Будь-яка" />
      <AuthorPicker value={value.author} onChange={(author) => set({ author })} clearable />
      <PublisherPicker value={value.publisher} onChange={(publisher) => set({ publisher })} clearable placeholder="Будь-яке" />
      <Select label="Є в магазині" placeholder="Будь-де" clearable searchable value={value.availableAt}
        data={stores.map((store) => ({ value: store.id, label: store.name }))}
        onChange={(availableAt) => set({ availableAt })} />
      <Select label="Статус" data={statusOptions} value={value.status} allowDeselect={false}
        onChange={(status) => set({ status: (status as StatusFilter | null) ?? 'active' })} />
      <Button variant="default" disabled={!hasFilter(value)} onClick={() => onChange(noFilter)}>Скинути фільтри</Button>
    </SimpleGrid>
  )
}
