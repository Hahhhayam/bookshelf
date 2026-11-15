import { NumberInput, Stack, Text } from '@mantine/core'
import { Controller, useFormContext } from 'react-hook-form'
import { Panel } from '@/shared/ui'
import type { BookFormValues } from '@/features/catalog-book-form'

/** The starting price, set once; later changes go through the «Змінити ціну» dialog. */
export function PriceCard() {
  const { control, formState: { errors } } = useFormContext<BookFormValues>()
  return (
    <Panel title="Ціна" padding={16}>
      <Stack gap="sm">
        <Controller control={control} name="price" render={({ field }) => (
          <NumberInput label="Роздрібна ціна, ₴" withAsterisk min={0} decimalScale={2} fixedDecimalScale
            decimalSeparator="," thousandSeparator=" " hideControls
            value={Number.isNaN(field.value) ? '' : field.value}
            onChange={(v) => field.onChange(typeof v === 'number' ? v : Number.NaN)}
            error={errors.price?.message} />
        )} />
        <Text size="xs" c="dimmed">Пізніші зміни ціни — через діалог «Змінити ціну»; нова ціна діє одразу.</Text>
      </Stack>
    </Panel>
  )
}
