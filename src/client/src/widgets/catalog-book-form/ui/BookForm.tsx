import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, SimpleGrid, Stack } from '@mantine/core'
import type { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { errorMessage, Panel } from '@/shared/ui'
import { bookFormSchema, emptyBook, type BookFormValues } from '@/features/catalog-book-form'
import { BookDetailsFields } from './BookDetailsFields'
import { PriceCard } from './PriceCard'

/**
 * The BookForm artboard: details on the left, price (when adding) or the page's own side blocks on the right.
 * It only collects and validates; the page decides what saving means.
 */
export function BookForm({ mode, defaultValues = emptyBook, readOnly = false, submitting, error, aside, onSubmit, onCancel }: {
  mode: 'add' | 'edit'
  defaultValues?: BookFormValues
  readOnly?: boolean
  submitting?: boolean
  error?: unknown
  aside?: ReactNode
  onSubmit: (values: BookFormValues) => void
  onCancel: () => void
}) {
  const form = useForm<BookFormValues>({ resolver: zodResolver(bookFormSchema), defaultValues })
  const adding = mode === 'add'

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} aria-label={adding ? 'Нова книга' : 'Редагування книги'} noValidate>
        <Stack gap="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" style={{ alignItems: 'start' }}>
            <Panel padding={20}><BookDetailsFields adding={adding} readOnly={readOnly} /></Panel>
            <Stack gap="lg">
              {adding && <PriceCard />}
              {aside}
            </Stack>
          </SimpleGrid>
          {error != null && <Alert color="red" title="Не вдалося зберегти">{errorMessage(error)}</Alert>}
          {!readOnly && (
            <Group justify="flex-end" gap="sm">
              <Button variant="subtle" color="gray" onClick={onCancel}>Скасувати</Button>
              <Button type="submit" loading={submitting}>{adding ? 'Додати до каталогу' : 'Зберегти зміни'}</Button>
            </Group>
          )}
        </Stack>
      </form>
    </FormProvider>
  )
}
