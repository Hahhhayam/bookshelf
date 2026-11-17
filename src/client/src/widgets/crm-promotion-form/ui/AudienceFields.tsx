import { SegmentedControl, Select, Stack, Text, TextInput } from '@mantine/core'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useReferenceList } from '@/entities/reference'
import type { PromotionValues } from '@/features/crm-create-promotion'

/** Who gets the promotion: every buyer, or, as a personal offer, a customer segment or one customer (by card at the till). */
export function AudienceFields() {
  const { control, register, formState: { errors } } = useFormContext<PromotionValues>()
  const audience = useWatch({ control, name: 'audience' })
  const segments = useReferenceList('segments', { enabled: audience === 'segment' })
  return (
    <Stack gap="sm">
      <Text size="sm" fw={600}>Для кого</Text>
      <Controller control={control} name="audience" render={({ field }) => (
        <SegmentedControl value={field.value} onChange={field.onChange} fullWidth
          data={[{ value: 'everyone', label: 'Усі покупці' }, { value: 'segment', label: 'Сегмент' }, { value: 'customer', label: 'Один клієнт' }]} />
      )} />
      {audience === 'segment' && (
        <Controller control={control} name="segment" render={({ field }) => (
          <Select label="Сегмент" withAsterisk searchable value={field.value} onChange={field.onChange}
            data={(segments.data ?? []).map((s) => ({ value: s.id, label: s.name }))}
            placeholder={segments.isPending ? 'Завантаження…' : 'Оберіть сегмент'} error={errors.segment?.message} />
        )} />
      )}
      {audience === 'customer' && (
        <TextInput label="Ідентифікатор клієнта" withAsterisk {...register('customer')} error={errors.customer?.message}
          description="Є в картці клієнта; знижку отримає лише покупка з його карткою"
          styles={{ input: { fontFamily: 'var(--mantine-font-family-monospace)' } }} />
      )}
    </Stack>
  )
}
