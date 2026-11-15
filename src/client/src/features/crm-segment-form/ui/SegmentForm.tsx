import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { errorMessage } from '@/shared/ui'
import type { SegmentValues } from '../model/useSaveSegment'

const schema = z.object({
  name: z.string().trim().min(1, 'Вкажіть назву сегмента'),
  description: z.string().max(500, 'Не більше 500 символів'),
})

export function SegmentForm({ defaultValues = { name: '', description: '' }, submitLabel, submitting, error, onSubmit, onCancel }: {
  defaultValues?: SegmentValues
  submitLabel: string
  submitting?: boolean
  error?: unknown
  onSubmit: (values: SegmentValues) => Promise<unknown> | void
  onCancel?: () => void
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SegmentValues>({ resolver: zodResolver(schema), defaultValues })

  async function submit(values: SegmentValues) {
    try {
      await onSubmit(values)
      if (!onCancel) reset({ name: '', description: '' })
    } catch {
      /* shown through `error` */
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <Stack gap="sm">
        <TextInput label="Назва" withAsterisk {...register('name')} error={errors.name?.message} placeholder="Наприклад, Батьки дітей 6–10" />
        <Textarea label="Опис" autosize minRows={2} {...register('description')} error={errors.description?.message}
          placeholder="Кого об’єднує сегмент і для чого він" />
        {error != null && <Alert color="red">{errorMessage(error)}</Alert>}
        <Group justify="flex-end" gap="sm">
          {onCancel && <Button variant="default" onClick={onCancel}>Скасувати</Button>}
          <Button type="submit" loading={submitting}>{submitLabel}</Button>
        </Group>
      </Stack>
    </form>
  )
}
