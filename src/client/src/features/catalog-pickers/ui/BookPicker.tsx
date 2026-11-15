import { Select } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import { useBookSearch } from '@/entities/book'
import { formatMoney } from '@/shared/lib'

/** Picks one book by searching the catalog by title or barcode (at least two characters). */
export function BookPicker({ value, onChange, label = 'Книга', error, required }: {
  value: string | null
  onChange: (value: string | null) => void
  label?: string
  error?: string
  required?: boolean
}) {
  const [search, setSearch] = useState('')
  const [chosen, setChosen] = useState<{ value: string; label: string } | null>(null)
  const [text] = useDebouncedValue(search.trim(), 300)
  const hits = useBookSearch({ text }, text.length >= 2 && text !== chosen?.label)

  const found = (hits.data ?? []).map((hit) => ({ value: hit.id, label: `${hit.title} · ${formatMoney(hit.price)}` }))
  const data = [...(chosen && value === chosen.value ? [chosen] : []), ...found.filter((hit) => hit.value !== chosen?.value)]

  return (
    <Select
      label={label} withAsterisk={required} error={error} searchable clearable
      placeholder="Назва або штрихкод"
      data={data}
      filter={({ options }) => options}
      value={value}
      onChange={(next, option) => { setChosen(option ? { value: option.value, label: option.label } : null); onChange(next) }}
      searchValue={search} onSearchChange={setSearch}
      nothingFoundMessage={text.length < 2 ? 'Введіть щонайменше 2 символи' : hits.isFetching ? 'Шукаємо…' : 'Нічого не знайдено'}
    />
  )
}
