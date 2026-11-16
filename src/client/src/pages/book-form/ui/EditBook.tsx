import { Alert, Anchor, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { saleStatus, useBookCard, type BookCard, type RemovalMode } from '@/entities/book'
import { useCan } from '@/entities/viewer'
import { fromCard, useUpdateBook } from '@/features/catalog-book-form'
import { ChangePriceButton } from '@/features/catalog-price-change'
import { removalText, RemoveBookButton } from '@/features/catalog-remove-book'
import { Perm } from '@/shared/lib'
import { PageHeader, QueryView, StatusBadge } from '@/shared/ui'
import { BookForm } from '@/widgets/catalog-book-form'
import { PriceHistoryPanel } from '@/widgets/catalog-price-history'

export function EditBook({ id }: { id: string }) {
  const card = useBookCard(id)
  return <QueryView query={card} skeletonRows={8}>{(book) => <Editor key={book.id} book={book} />}</QueryView>
}

function Editor({ book }: { book: BookCard }) {
  const navigate = useNavigate()
  const can = useCan()
  const update = useUpdateBook(book.id)
  const [removed, setRemoved] = useState<RemovalMode | null>(null)
  const canEdit = can(Perm.CatalogEdit)

  function onRemoved(mode: RemovalMode) {
    if (mode === 'Delete') navigate('/staff/catalog')
    else setRemoved(mode)
  }

  const priceAction = can(Perm.PriceChange) && book.status === 'Active'
    ? <ChangePriceButton bookId={book.id} current={book.price}
        subtitle={[book.title, book.isbn && `ISBN ${book.isbn}`].filter(Boolean).join(' · ')} />
    : undefined

  return (
    <Stack gap="lg">
      <PageHeader eyebrow={<Anchor component={Link} to="/staff/catalog" size="sm">Каталог</Anchor>}
        title={book.title} after={<StatusBadge {...saleStatus[book.status]} />}
        actions={canEdit && book.status === 'Active' && <RemoveBookButton bookId={book.id} title={book.title} onRemoved={onRemoved} />} />
      {removed && <Alert color="yellow" title="Деактивовано, а не видалено">{removalText[removed]}</Alert>}
      <BookForm mode="edit" defaultValues={fromCard(book)} readOnly={!canEdit} submitting={update.isPending}
        error={update.error ?? undefined} onSubmit={(values) => update.mutate(values)}
        onCancel={() => navigate('/staff/catalog')}
        aside={<PriceHistoryPanel bookId={book.id} action={priceAction} />} />
      <Text size="sm" c="dimmed">
        {book.itemType === 'Book' ? 'Книга' : 'Інший товар'}{book.isbn && ` · ISBN ${book.isbn}`}. Тип і ISBN після створення не змінюються.
      </Text>
    </Stack>
  )
}
