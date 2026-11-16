import { NumberInput } from '@mantine/core'
import { Controller, useFormContext } from 'react-hook-form'
import { Panel } from '@/shared/ui'
import type { BookFormValues } from '@/features/catalog-book-form'

/** The starting price, set once; later changes go through the «Змінити ціну» dialog. */
export function PriceCard() {
  const { control, formState: { errors } } = useFormContext<BookFormValues>()
  return (
    <Panel title="Ціна" padding={16}>
      <Controller control={control} name="price" render={({ field }) => (
        <NumberInput label="Роздрібна ціна, ₴" withAsterisk min={0} decimalScale={2} fixedDecimalScale
          decimalSeparator="," thousandSeparator=" " hideControls
          value={Number.isNaN(field.value) ? '' : field.value}
          onChange={(v) => field.onChange(typeof v === 'number' ? v : Number.NaN)}
          error={errors.price?.message} />
      )} />
    </Panel>
  )
}
