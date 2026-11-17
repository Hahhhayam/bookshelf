import { Alert, Anchor, Stack, Tabs, Text } from '@mantine/core'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { saleStatus, useBookCard, type BookCard, type RemovalMode } from '@/entities/book'
import { useCan } from '@/entities/viewer'
import { fromCard, useUpdateBook } from '@/features/catalog-book-form'
import { ActivateBookButton } from '@/features/catalog-activate-book'
import { ChangePriceButton } from '@/features/catalog-price-change'
import { removalText, RemoveBookButton } from '@/features/catalog-remove-book'
import { formatDateTime, formatMoney, Perm } from '@/shared/lib'
import { PageHeader, QueryView, StatusBadge } from '@/shared/ui'
import { BookForm } from '@/widgets/catalog-book-form'
import { PriceHistoryPanel } from '@/widgets/catalog-price-history'
import { BookHistory } from './BookHistory'

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

  const form = (
    <Stack gap="lg">
      <BookForm mode="edit" defaultValues={fromCard(book)} readOnly={!canEdit} submitting={update.isPending}
        error={update.error ?? undefined} onSubmit={(values) => update.mutate(values)}
        onCancel={() => navigate('/staff/catalog')}
        aside={<PriceHistoryPanel bookId={book.id} action={priceAction} />} />
      <Text size="sm" c="dimmed">
        {book.itemType === 'Book' ? 'Книга' : 'Інший товар'}{book.isbn && ` · ISBN ${book.isbn}`}. Тип і ISBN після створення не змінюються.
      </Text>
    </Stack>
  )

  return (
    <Stack gap="lg">
      <PageHeader eyebrow={<Anchor component={Link} to="/staff/catalog" size="sm">Каталог</Anchor>}
        title={book.title} after={<StatusBadge {...saleStatus[book.status]} />}
        actions={canEdit && (book.status === 'Active'
          ? <RemoveBookButton bookId={book.id} title={book.title} onRemoved={onRemoved} />
          : <ActivateBookButton bookId={book.id} title={book.title} />)} />
      {removed && book.status === 'Deactivated' && <Alert color="yellow" title="Деактивовано, а не видалено">{removalText[removed]}</Alert>}
      <ScheduledPriceNote book={book} />
      {can(Perm.AuditView) ? <WithHistory bookId={book.id}>{form}</WithHistory> : form}
    </Stack>
  )
}

function ScheduledPriceNote({ book }: { book: BookCard }) {
  if (!book.scheduledPrice) return null
  return (
    <Alert color="blue" title="Заплановано нову ціну">
      {formatMoney(book.scheduledPrice.price)} з {formatDateTime(book.scheduledPrice.effectiveFrom)}; до того діє {formatMoney(book.price)}.
    </Alert>
  )
}

function WithHistory({ bookId, children }: { bookId: string; children: ReactNode }) {
  return (
    <Tabs defaultValue="card" keepMounted={false}>
      <Tabs.List mb="md"><Tabs.Tab value="card">Картка</Tabs.Tab><Tabs.Tab value="history">Історія</Tabs.Tab></Tabs.List>
      <Tabs.Panel value="card">{children}</Tabs.Panel>
      <Tabs.Panel value="history"><BookHistory bookId={bookId} /></Tabs.Panel>
    </Tabs>
  )
}
