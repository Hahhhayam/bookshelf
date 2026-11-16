import { Button, Stack, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconBooks, IconPlus, IconSearchOff } from '@tabler/icons-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { compactIsbn, useBookSearch, type BookSearch } from '@/entities/book'
import { useCan } from '@/entities/viewer'
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
  }
}

/** Scenario 3.2: the staff catalog. The list is a search; with no query or filter there is nothing to show yet. */
export default function CatalogAdminPage() {
  const can = useCan()
  const [filter, setFilter] = useState<CatalogFilter>(noFilter)
  const [debounced] = useDebouncedValue(filter, 350)
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
            text="Введіть назву, штрихкод чи ISBN або оберіть категорію чи автора — список з’явиться тут." />
        ) : (
          <QueryView query={search} isEmpty={(books) => books.length === 0}
            empty={<EmptyState icon={<IconSearchOff size={40} stroke={1.5} />} title="За цими фільтрами — нічого"
              text="Перевірте написання або приберіть частину фільтрів."
              actions={<Button variant="default" onClick={() => setFilter(noFilter)}>Скинути фільтри</Button>} />}>
            {(books) => (
              <>
                <BookTable books={books} />
                <Text size="sm" c="dimmed" px="md" py="sm">Знайдено: {books.length}. Деактивовані книги пошук не показує.</Text>
              </>
            )}
          </QueryView>
        )}
      </Panel>
    </Stack>
  )
}
