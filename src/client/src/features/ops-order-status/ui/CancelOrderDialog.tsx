import { Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { useChangeOrderStatus } from '../model/useChangeOrderStatus'

export function CancelOrderDialog({ id, number, opened, onClose }: {
  id: string
  number: string
  opened: boolean
  onClose: () => void
}) {
  const change = useChangeOrderStatus()

  function cancel() {
    change.mutate({ id, status: 'Cancelled' }, {
      onSuccess: () => {
        notifications.show({ color: 'green', message: `Замовлення ${number} скасовано` })
        onClose()
      },
    })
  }

  return (
    <ConfirmDialog
      opened={opened}
      title={`Скасувати замовлення ${number}?`}
      confirmLabel="Скасувати замовлення"
      danger
      loading={change.isPending}
      onConfirm={cancel}
      onClose={() => { change.reset(); onClose() }}
    >
      <Text size="md">Резерв книжок буде знято, клієнт побачить статус «Скасоване». Повернути замовлення не можна.</Text>
      {change.isError && <Text size="sm" c="red" mt="sm">{errorMessage(change.error)}</Text>}
    </ConfirmDialog>
  )
}
