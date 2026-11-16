import { Anchor, Stack, Text } from '@mantine/core'
import { Link, useNavigate } from 'react-router'
import { useAddBook } from '@/features/catalog-book-form'
import { BookForm } from '@/widgets/catalog-book-form'
import { PageHeader } from '@/shared/ui'

export function AddBook() {
  const navigate = useNavigate()
  const add = useAddBook()
  return (
    <Stack gap="lg">
      <PageHeader eyebrow={<Anchor component={Link} to="/staff/catalog" size="sm">Каталог</Anchor>} title="Нова книга" />
      <Text size="sm" c="dimmed">
        Поля з <Text span c="red">*</Text> обов’язкові.
      </Text>
      <BookForm mode="add" submitting={add.isPending} error={add.error ?? undefined}
        onSubmit={(values) => add.mutate(values, { onSuccess: ({ id }) => navigate(`/staff/catalog/${id}`) })}
        onCancel={() => navigate('/staff/catalog')} />
    </Stack>
  )
}
