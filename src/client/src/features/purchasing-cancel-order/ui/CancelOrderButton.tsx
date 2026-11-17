import { Alert, Button, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { useCancelOrder } from '../model/useCancelOrder'

/** Cancels an order that has received no goods yet (a draft or one sent to the supplier); it cannot be undone. */
export function CancelOrderButton({ orderId, supplierName }: { orderId: string; supplierName: string }) {
  const [opened, setOpened] = useState(false)
  const cancel = useCancelOrder()

  function close() {
    setOpened(false)
    cancel.reset()
  }

  return (
    <>
      <Button variant="default" color="red" leftSection={<IconX size={16} />} onClick={() => setOpened(true)}>Скасувати замовлення</Button>
      <ConfirmDialog
        opened={opened}
        title="Скасувати замовлення?"
        confirmLabel="Скасувати замовлення"
        loading={cancel.isPending}
        onClose={close}
        onConfirm={() => cancel.mutate(orderId, { onSuccess: () => setOpened(false) })}
      >
        <Text size="sm">
          Замовлення постачальнику «{supplierName}» буде скасовано, і склад не прийматиме поставку за ним. Відновити
          скасоване замовлення не можна.
        </Text>
        {cancel.isError && <Alert color="red" variant="light" mt="sm">{errorMessage(cancel.error)}</Alert>}
      </ConfirmDialog>
    </>
  )
}
