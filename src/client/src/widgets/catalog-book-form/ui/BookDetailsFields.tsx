import { SegmentedControl, Stack, Text, TextInput } from '@mantine/core'
import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { AuthorsPicker, CategoryPicker, PublisherPicker } from '@/features/catalog-pickers'
import { tokens } from '@/shared/config/tokens'
import { compactIsbn, isValidIsbn } from '@/features/catalog-book-form'
import type { BookFormValues } from '@/features/catalog-book-form'
import { IsbnCheck } from './IsbnCheck'

const mono = { input: { fontFamily: tokens.font.mono } }

/** The main card of the BookForm artboard. Type and ISBN are fixed once the book exists. */
export function BookDetailsFields({ adding, readOnly }: { adding: boolean; readOnly: boolean }) {
  const { register, control, formState: { errors } } = useFormContext<BookFormValues>()
  const [isbn, itemType] = useWatch({ control, name: ['isbn', 'itemType'] })
  useBarcodeFromIsbn(adding)

  return (
    <Stack gap="md">
      <TextInput label="Назва" withAsterisk {...register('title')} error={errors.title?.message} readOnly={readOnly} />
      {adding && (
        <Controller control={control} name="itemType" render={({ field }) => (
          <Stack gap={6}>
            <Text size="sm" fw={600}>Тип товару</Text>
            <SegmentedControl value={field.value} onChange={field.onChange}
              data={[{ value: 'Book', label: 'Книга' }, { value: 'Other', label: 'Інший товар' }]} />
          </Stack>
        )} />
      )}
      {adding && (
        <Stack gap={4}>
          <TextInput label="ISBN" description="Необов’язково для інших товарів" {...register('isbn')}
            error={errors.isbn?.message} styles={mono} />
          {!errors.isbn && <IsbnCheck isbn={isbn} />}
        </Stack>
      )}
      <TextInput label="Штрихкод EAN-13" withAsterisk {...register('barcode')} error={errors.barcode?.message}
        description={adding ? 'Заповнюється з ISBN. Змініть, лише якщо на книзі інший.' : undefined}
        styles={mono} readOnly={readOnly} />
      <Controller control={control} name="authors" render={({ field }) => (
        <AuthorsPicker value={field.value} onChange={field.onChange} creatable={!readOnly} disabled={readOnly}
          required={itemType === 'Book'} error={errors.authors?.message} />
      )} />
      <Controller control={control} name="category" render={({ field }) => (
        <CategoryPicker value={field.value || null} onChange={(v) => field.onChange(v ?? '')} required
          creatable={!readOnly} disabled={readOnly} error={errors.category?.message} />
      )} />
      <Controller control={control} name="publisher" render={({ field }) => (
        <PublisherPicker value={field.value} onChange={field.onChange} clearable creatable={!readOnly} disabled={readOnly} />
      )} />
    </Stack>
  )
}

function useBarcodeFromIsbn(adding: boolean) {
  const { control, setValue, getFieldState, formState } = useFormContext<BookFormValues>()
  const isbn = useWatch({ control, name: 'isbn' })
  const barcodeTouched = getFieldState('barcode', formState).isDirty
  useEffect(() => {
    const digits = compactIsbn(isbn)
    if (adding && !barcodeTouched && digits.length === 13 && isValidIsbn(digits)) setValue('barcode', digits)
  }, [adding, isbn, barcodeTouched, setValue])
}
