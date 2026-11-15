import { ActionIcon, Group, NumberInput, Text, UnstyledButton } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconPencil, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { errorMessage } from '@/shared/ui'
import { useSetMinimum } from '../model/mutations'

/** The minimum stock of a book, edited in place by users who may adjust stock. */
export function MinimumCell({ location, book, minimum, editable }: {
  location: string
  book: string
  minimum: number
  editable: boolean
}) {
  const [draft, setDraft] = useState<number | null>(null)
  const save = useSetMinimum(location)

  if (!editable) return <Text size="md">{minimum}</Text>
  if (draft === null) {
    return (
      <UnstyledButton onClick={() => setDraft(minimum)} aria-label="Змінити мінімум">
        <Group gap={6} wrap="nowrap"><Text size="md">{minimum}</Text><IconPencil size={14} stroke={1.75} /></Group>
      </UnstyledButton>
    )
  }

  function submit() {
    if (draft === null || draft === minimum) return setDraft(null)
    save.mutate({ book, minimum: draft }, {
      onSuccess: () => setDraft(null),
      onError: (error) => notifications.show({ color: 'red', title: 'Мінімум не змінено', message: errorMessage(error) }),
    })
  }

  return (
    <Group gap={4} wrap="nowrap">
      <NumberInput
        size="xs" w={72} min={0} allowDecimal={false} autoFocus aria-label="Мінімальний залишок"
        value={draft}
        onChange={(value) => setDraft(typeof value === 'number' ? value : 0)}
        onKeyDown={(event) => { if (event.key === 'Enter') submit(); if (event.key === 'Escape') setDraft(null) }}
      />
      <ActionIcon variant="subtle" aria-label="Зберегти" loading={save.isPending} onClick={submit}><IconCheck size={16} /></ActionIcon>
      <ActionIcon variant="subtle" color="gray" aria-label="Скасувати" onClick={() => setDraft(null)}><IconX size={16} /></ActionIcon>
    </Group>
  )
}
