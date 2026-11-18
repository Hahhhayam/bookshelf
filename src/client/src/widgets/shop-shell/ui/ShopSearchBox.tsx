import { Combobox, Group, Text, TextInput, useCombobox } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useBookSearch } from '@/entities/book'
import { isSearchable, isTooShort, searchDebounceMs, searchHint } from '@/shared/config/search'
import { MoneyText } from '@/shared/ui'

const suggestionLimit = 6

/** The shop's search: suggestions appear under the box while typing; a click opens that book, Enter shows all results. */
export function ShopSearchBox() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [text, setText] = useState(params.get('q') ?? '')
  const [debounced] = useDebouncedValue(text.trim(), searchDebounceMs)
  const combobox = useCombobox()
  const ready = isSearchable(debounced)
  const found = useBookSearch({ text: debounced, suggestClosest: true }, ready)
  const hits = (ready ? found.data : undefined)?.slice(0, suggestionLimit) ?? []

  function submit(event: FormEvent) {
    event.preventDefault()
    combobox.closeDropdown()
    if (isSearchable(text)) navigate(`/?q=${encodeURIComponent(text.trim())}`)
    else if (!text.trim()) navigate('/')
  }

  function open(id: string) {
    combobox.closeDropdown()
    navigate(`/books/${id}`)
  }

  return (
    <form onSubmit={submit} style={{ flex: 1, maxWidth: 560 }} role="search">
      <Combobox store={combobox} onOptionSubmit={open} withinPortal>
        <Combobox.Target>
          <TextInput size="lg" aria-label="Пошук книг" placeholder="Назва, автор або ISBN" value={text}
            error={isTooShort(text) ? searchHint : undefined} leftSection={<IconSearch size={18} />}
            onChange={(e) => { setText(e.currentTarget.value); combobox.openDropdown() }}
            onFocus={() => combobox.openDropdown()} onBlur={() => combobox.closeDropdown()} />
        </Combobox.Target>
        <Combobox.Dropdown hidden={!ready || found.isPending}>
          <Combobox.Options>
            {hits.length > 0 && hits.every((hit) => hit.suggested) && (
              <Combobox.Header><Text size="sm" c="dimmed">Точних збігів немає. Можливо, ви шукали:</Text></Combobox.Header>
            )}
            {hits.map((hit) => (
              <Combobox.Option key={hit.id} value={hit.id}>
                <Group justify="space-between" wrap="nowrap" gap="md">
                  <Text size="md" truncate>{hit.title}</Text>
                  <MoneyText value={hit.price} size={14} />
                </Group>
              </Combobox.Option>
            ))}
            {hits.length === 0 && <Combobox.Empty>Нічого не знайдено</Combobox.Empty>}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </form>
  )
}
