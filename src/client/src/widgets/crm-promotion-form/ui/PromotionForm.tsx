import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, NumberInput, SimpleGrid, Stack, TextInput } from '@mantine/core'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { emptyPromotion, promotionSchema, useCreatePromotion, type PromotionValues } from '@/features/crm-create-promotion'
import { errorMessage } from '@/shared/ui'
import { ConditionFields } from './ConditionFields'

/** FR-15: a promotion with a period, a condition, a discount and a priority (the higher one wins when they overlap). */
export function PromotionForm({ onCreated }: { onCreated?: () => void }) {
  const create = useCreatePromotion()
  const form = useForm<PromotionValues>({ resolver: zodResolver(promotionSchema), defaultValues: emptyPromotion })
  const { register, control, formState: { errors } } = form

  function submit(values: PromotionValues) {
    create.mutate(values, { onSuccess: () => { form.reset(emptyPromotion); onCreated?.() } })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)} noValidate aria-label="Нова акція">
        <Stack gap="md">
          <TextInput label="Назва" withAsterisk {...register('name')} error={errors.name?.message} placeholder="Осінні читання" />
          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
            <TextInput type="datetime-local" label="Діє з" withAsterisk {...register('from')} error={errors.from?.message} />
            <TextInput type="datetime-local" label="Діє до" withAsterisk {...register('to')} error={errors.to?.message} />
          </SimpleGrid>
          <ConditionFields />
          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
            <Controller control={control} name="discountPercent" render={({ field }) => (
              <NumberInput label="Знижка, %" withAsterisk min={0} max={100} decimalScale={2} decimalSeparator=","
                value={Number.isNaN(field.value) ? '' : field.value} error={errors.discountPercent?.message}
                onChange={(v) => field.onChange(typeof v === 'number' ? v : Number.NaN)} />
            )} />
            <Controller control={control} name="priority" render={({ field }) => (
              <NumberInput label="Пріоритет" description="Вищий перемагає, якщо акції перетинаються" allowDecimal={false}
                value={Number.isNaN(field.value) ? '' : field.value} error={errors.priority?.message}
                onChange={(v) => field.onChange(typeof v === 'number' ? v : Number.NaN)} />
            )} />
          </SimpleGrid>
          {create.isError && <Alert color="red" title="Не вдалося створити">{errorMessage(create.error)}</Alert>}
          <Group justify="flex-end">
            <Button type="submit" loading={create.isPending}>Створити акцію</Button>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  )
}
