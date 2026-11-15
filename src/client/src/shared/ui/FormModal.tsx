import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import type { FormEvent, ReactNode } from 'react'

/** A modal form: fields, the refusal message if the server said no, and a submit button that names the action. */
export function FormModal({ opened, title, submitLabel, error, loading, onSubmit, onClose, children }: {
  opened: boolean
  title: string
  submitLabel: string
  error?: string | null
  loading?: boolean
  onSubmit: () => void
  onClose: () => void
  children: ReactNode
}) {
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }
  return (
    <Modal opened={opened} onClose={onClose} title={<Text fw={600} fz={20}>{title}</Text>} centered shadow="xl">
      <form onSubmit={submit} noValidate>
        <Stack gap="md">
          {children}
          {error && <Alert color="red" variant="light">{error}</Alert>}
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={onClose}>Скасувати</Button>
            <Button type="submit" loading={loading}>{submitLabel}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
