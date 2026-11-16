import { Button, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import type { TransferStep } from '@/entities/transfer'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { useApproveOrShip } from '../model/mutations'

/** Approve or ship, after a confirmation that says what will happen. */
export function TransferStepButton({ id, step }: { id: string; step: TransferStep & { kind: 'approve' | 'ship' } }) {
  const [opened, setOpened] = useState(false)
  const mutation = useApproveOrShip(id, step.kind)

  function close() {
    mutation.reset()
    setOpened(false)
  }

  function confirm() {
    mutation.mutate(undefined, {
      onSuccess: () => {
        notifications.show({ color: 'green', message: step.kind === 'approve' ? 'Переміщення погоджено' : 'Переміщення відправлено' })
        setOpened(false)
      },
    })
  }

  return (
    <>
      <Button onClick={() => setOpened(true)}>{step.label}</Button>
      <ConfirmDialog
        opened={opened}
        title={step.confirmTitle}
        confirmLabel={step.label}
        loading={mutation.isPending}
        onConfirm={confirm}
        onClose={close}
      >
        <Text size="md">{step.confirmText}</Text>
        {mutation.isError && <Text size="sm" c="red" mt="sm">{errorMessage(mutation.error)}</Text>}
      </ConfirmDialog>
    </>
  )
}
