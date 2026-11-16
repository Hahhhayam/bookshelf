import { Select, type SelectProps } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import { formatMoney } from '@/shared/lib'
import { compactIsbn, looksLikeIsbn } from '../model/isbn'
import { useBookSearch } from '../model/queries'

type Option = { value: string; label: string }

function nothingFound(text: string, fetching: boolean) {
  if (text.length < 2) return 'Введіть щонайменше 2 символи'
  return fetching ? 'Шукаємо…' : 'Нічого не знайдено'
}

/** Picks one book by searching the catalog by title or ISBN (at least two characters). */
export function BookPicker({ value, onChange, ...select }: {
  value: string | null
  onChange: (value: string | null) => void
} & Omit<SelectProps, 'value' | 'onChange' | 'data' | 'searchable' | 'searchValue' | 'onSearchChange' | 'filter'>) {
  const [search, setSearch] = useState('')
  const [chosen, setChosen] = useState<Option | null>(null)
  const [text] = useDebouncedValue(search.trim(), 300)
  const query = looksLikeIsbn(text) ? { isbn: compactIsbn(text) } : { text }
  const hits = useBookSearch(query, text.length >= 2 && text !== chosen?.label)

  const found = (hits.data ?? []).map((hit) => ({ value: hit.id, label: `${hit.title} · ${formatMoney(hit.price)}` }))
  const data = [...(chosen && value === chosen.value ? [chosen] : []), ...found.filter((hit) => hit.value !== chosen?.value)]

  return (
    <Select
      placeholder="Назва або ISBN" clearable nothingFoundMessage={nothingFound(text, hits.isFetching)}
      {...select}
      searchable data={data} filter={({ options }) => options} value={value}
      onChange={(next, option) => { setChosen(option ? { value: option.value, label: option.label } : null); onChange(next) }}
      searchValue={search} onSearchChange={setSearch}
    />
  )
}
