import { NumberInput, SegmentedControl, Stack, Text } from '@mantine/core'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import type { PromotionValues } from '@/features/crm-create-promotion'
import { BookPicker, CategoryPicker } from '@/features/catalog-pickers'

/** When the promotion applies: to every book, one book, or one category — from a minimum quantity in the receipt. */
export function ConditionFields() {
  const { control, formState: { errors } } = useFormContext<PromotionValues>()
  const scope = useWatch({ control, name: 'scope' })
  return (
    <Stack gap="sm">
      <Text size="sm" fw={600}>Умова</Text>
      <Controller control={control} name="scope" render={({ field }) => (
        <SegmentedControl value={field.value} onChange={field.onChange} fullWidth
          data={[{ value: 'all', label: 'Усі книги' }, { value: 'book', label: 'Книга' }, { value: 'category', label: 'Категорія' }]} />
      )} />
      {scope === 'book' && (
        <Controller control={control} name="book" render={({ field }) => (
          <BookPicker value={field.value} onChange={field.onChange} required error={errors.book?.message} />
        )} />
      )}
      {scope === 'category' && (
        <Controller control={control} name="category" render={({ field }) => (
          <CategoryPicker value={field.value} onChange={field.onChange} required error={errors.category?.message} />
        )} />
      )}
      <Controller control={control} name="minimumQuantity" render={({ field }) => (
        <NumberInput label="Мінімальна кількість у чеку" min={1} allowDecimal={false} value={Number.isNaN(field.value) ? '' : field.value}
          onChange={(v) => field.onChange(typeof v === 'number' ? v : Number.NaN)} error={errors.minimumQuantity?.message} />
      )} />
    </Stack>
  )
}
