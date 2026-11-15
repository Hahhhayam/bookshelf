import { Select } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { useBookSearch } from '@/entities/book'

const isbnLike = /^(97[89])?\d{9}[\dX]$/i

/** Optional filter by one book, found by title or ISBN. */
export function BookFilter({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  const [search, setSearch] = useState('')
  const [picked, setPicked] = useState<{ value: string; label: string } | null>(null)
  const [debounced] = useDebouncedValue(search.trim(), 300)
  const compact = debounced.replace(/[-\s]/g, '')
  const hits = useBookSearch(isbnLike.test(compact) ? { isbn: compact } : { text: debounced }, debounced.length >= 2)

  const found = (hits.data ?? []).map((hit) => ({ value: hit.id, label: hit.title }))
  const data = picked && !found.some((option) => option.value === picked.value) ? [picked, ...found] : found

  return (
    <Select
      aria-label="Фільтр за книгою" placeholder="Книга або ISBN" leftSection={<IconSearch size={16} stroke={1.75} />}
      searchable clearable value={value} data={data} searchValue={search} onSearchChange={setSearch}
      filter={({ options }) => options} w={{ base: '100%', sm: 240 }}
      nothingFoundMessage={debounced.length >= 2 ? (hits.isFetching ? 'Шукаємо…' : 'Нічого не знайдено') : 'Введіть 2+ символи'}
      onChange={(id, option) => {
        setPicked(id && option ? { value: option.value, label: option.label } : null)
        onChange(id)
      }}
    />
  )
}
