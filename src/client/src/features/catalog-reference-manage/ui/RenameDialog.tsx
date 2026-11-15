import { Alert, Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/ui'

export function RenameDialog({ opened, current, loading, error, onRename, onClose }: {
  opened: boolean
  current: string
  loading?: boolean
  error?: unknown
  onRename: (name: string) => void
  onClose: () => void
}) {
  const [name, setName] = useState(current)
  const [invalid, setInvalid] = useState<string | null>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return setInvalid('Вкажіть назву')
    onRename(name)
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Перейменувати" centered>
      <form onSubmit={submit}>
        <Stack gap="md">
          <TextInput label="Нова назва" data-autofocus value={name} error={invalid}
            onChange={(e) => { setName(e.currentTarget.value); setInvalid(null) }} />
          {error != null && <Alert color="red">{errorMessage(error)}</Alert>}
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={onClose}>Скасувати</Button>
            <Button type="submit" loading={loading}>Зберегти</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
