import { Button, SimpleGrid, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { AuthorPicker, CategoryPicker } from '@/features/catalog-pickers'

export interface CatalogFilter {
  text: string
  isbn: string
  category: string | null
  author: string | null
}

export const noFilter: CatalogFilter = { text: '', isbn: '', category: null, author: null }

export function hasFilter(filter: CatalogFilter) {
  return !!(filter.text.trim() || filter.isbn.trim() || filter.category || filter.author)
}

export function CatalogFilters({ value, onChange }: { value: CatalogFilter; onChange: (next: CatalogFilter) => void }) {
  const set = (patch: Partial<CatalogFilter>) => onChange({ ...value, ...patch })
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="sm" style={{ alignItems: 'end' }}>
      <TextInput label="Назва або штрихкод" leftSection={<IconSearch size={16} stroke={1.75} />} value={value.text}
        onChange={(e) => set({ text: e.currentTarget.value })} placeholder="Наприклад, Амадока" />
      <TextInput label="ISBN" value={value.isbn} onChange={(e) => set({ isbn: e.currentTarget.value })} placeholder="978-…" />
      <CategoryPicker value={value.category} onChange={(category) => set({ category })} clearable placeholder="Будь-яка" />
      <AuthorPicker value={value.author} onChange={(author) => set({ author })} clearable />
      <Button variant="default" disabled={!hasFilter(value)} onClick={() => onChange(noFilter)}>Скинути фільтри</Button>
    </SimpleGrid>
  )
}
