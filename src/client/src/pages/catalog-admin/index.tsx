import { Button, Stack, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconBooks, IconPlus, IconSearchOff } from '@tabler/icons-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { compactIsbn, useBookSearch, type BookHit, type BookSearch } from '@/entities/book'
import { useCan } from '@/entities/viewer'
import { isSearchable, searchDebounceMs } from '@/shared/config/search'
import { Perm } from '@/shared/lib'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { BookTable } from './ui/BookTable'
import { CatalogFilters, hasFilter, noFilter, type CatalogFilter } from './ui/CatalogFilters'

function toSearch(filter: CatalogFilter): BookSearch {
  return {
    text: filter.text.trim() || undefined,
    isbn: filter.isbn.trim() ? compactIsbn(filter.isbn) : undefined,
    category: filter.category ?? undefined,
    author: filter.author ?? undefined,
    publisher: filter.publisher ?? undefined,
    availableAt: filter.availableAt ?? undefined,
    includeInactive: filter.status !== 'active' || undefined,
    suggestClosest: true,
  }
}

function byStatus(books: BookHit[], filter: CatalogFilter): BookHit[] {
  return filter.status === 'deactivated' ? books.filter((book) => book.status === 'Deactivated') : books
}

/** Scenario 3.2: the staff catalog. The list is a search; with no query or filter there is nothing to show yet. */
export default function CatalogAdminPage() {
  const can = useCan()
  const [filter, setFilter] = useState<CatalogFilter>(noFilter)
  const [typed] = useDebouncedValue(filter, searchDebounceMs)
  const debounced = isSearchable(typed.text) ? typed : { ...typed, text: '' }
  const active = hasFilter(debounced)
  const search = useBookSearch(toSearch(debounced), active)

  return (
    <Stack gap="lg">
      <PageHeader eyebrow="Каталог і ціни" title="Каталог"
        actions={<>
          {can(Perm.CatalogEdit) && <Button component={Link} to="/staff/catalog/references" variant="default">Довідники</Button>}
          {can(Perm.CatalogEdit) && <Button component={Link} to="/staff/catalog/new" leftSection={<IconPlus size={16} />}>Нова книга</Button>}
        </>} />
      <CatalogFilters value={filter} onChange={setFilter} />
      <Panel>
        {!active ? (
          <EmptyState icon={<IconBooks size={40} stroke={1.5} />} title="Знайдіть книгу"
            text="Введіть назву, штрихкод чи ISBN або оберіть категорію, автора, видавництво чи магазин — список з’явиться тут." />
        ) : (
          <QueryView query={search} isEmpty={(books) => byStatus(books, debounced).length === 0}
            empty={<EmptyState icon={<IconSearchOff size={40} stroke={1.5} />} title="За цими фільтрами — нічого"
              text="Перевірте написання або приберіть частину фільтрів."
              actions={<Button variant="default" onClick={() => setFilter(noFilter)}>Скинути фільтри</Button>} />}>
            {(found) => <Results books={byStatus(found, debounced)} status={debounced.status} />}
          </QueryView>
        )}
      </Panel>
    </Stack>
  )
}

function Results({ books, status }: { books: BookHit[]; status: CatalogFilter['status'] }) {
  return (
    <>
      <BookTable books={books} />
      <Text size="sm" c="dimmed" px="md" py="sm">
        {books.some((book) => book.suggested) ? 'Точних збігів немає — показано найближчі. ' : ''}
        Знайдено: {books.length}.{status === 'active' ? ' Деактивовані книги — у фільтрі «Статус».' : ''}
      </Text>
    </>
  )
}
