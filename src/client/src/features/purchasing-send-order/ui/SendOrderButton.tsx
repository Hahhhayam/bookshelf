import { Alert, Button, Text } from '@mantine/core'
import { IconSend } from '@tabler/icons-react'
import { useState } from 'react'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { useSendOrder } from '../model/useSendOrder'

/** Sends a draft to the supplier; after that its lines can no longer change, so it asks first. */
export function SendOrderButton({ orderId, supplierName }: { orderId: string; supplierName: string }) {
  const [opened, setOpened] = useState(false)
  const send = useSendOrder()

  function close() {
    setOpened(false)
    send.reset()
  }

  return (
    <>
      <Button leftSection={<IconSend size={16} />} onClick={() => setOpened(true)}>Відправити постачальнику</Button>
      <ConfirmDialog
        opened={opened}
        title="Відправити замовлення?"
        confirmLabel="Відправити постачальнику"
        loading={send.isPending}
        onClose={close}
        onConfirm={() => send.mutate(orderId, { onSuccess: () => setOpened(false) })}
      >
        <Text size="sm">
          Замовлення піде постачальнику «{supplierName}». Після відправлення склад зможе приймати поставку за ним,
          а змінити позиції вже не вийде.
        </Text>
        {send.isError && <Alert color="red" variant="light" mt="sm">{errorMessage(send.error)}</Alert>}
      </ConfirmDialog>
    </>
  )
}
