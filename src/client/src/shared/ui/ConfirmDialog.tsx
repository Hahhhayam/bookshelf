import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'

/** Confirmation before an irreversible action: says what will happen and names the action on the button. */
export function ConfirmDialog({ opened, title, children, confirmLabel, danger = false, loading, onConfirm, onClose }: {
  opened: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal opened={opened} onClose={onClose} title={<Text fw={600} fz={20}>{title}</Text>} centered shadow="xl">
      <Stack gap="lg">
        <div>{children}</div>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onClose}>Скасувати</Button>
          <Button color={danger ? 'red' : undefined} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
