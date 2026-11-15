import { Alert, Anchor, Button, Group, Text } from '@mantine/core'
import { useState } from 'react'
import { Link } from 'react-router'
import { SendAfterCreateError } from '@/features/purchasing-create-order'
import { ConfirmDialog, errorMessage } from '@/shared/ui'

/** Save as a draft, or save and send at once (asks first: a sent order cannot change). */
export function SubmitBar({ pending, error, supplierName, onSubmit }: {
  pending: boolean
  error: unknown
  supplierName: string | null
  onSubmit: (send: boolean) => void
}) {
  const [confirming, setConfirming] = useState(false)
  return (
    <>
      {error !== null && error !== undefined && <SubmitError error={error} />}
      <Group justify="flex-end" gap="sm">
        <Button component={Link} to="/staff/purchase-orders" variant="subtle" color="gray">Скасувати</Button>
        <Button variant="default" loading={pending} onClick={() => onSubmit(false)}>Зберегти чернетку</Button>
        <Button loading={pending} onClick={() => setConfirming(true)}>Зберегти і відправити</Button>
      </Group>
      <ConfirmDialog
        opened={confirming}
        title="Зберегти і відправити?"
        confirmLabel="Відправити постачальнику"
        loading={pending}
        onClose={() => setConfirming(false)}
        onConfirm={() => { setConfirming(false); onSubmit(true) }}
      >
        <Text size="sm">
          Замовлення піде постачальнику{supplierName ? ` «${supplierName}»` : ''}. Після відправлення змінити позиції не вийде.
        </Text>
      </ConfirmDialog>
    </>
  )
}

function SubmitError({ error }: { error: unknown }) {
  if (error instanceof SendAfterCreateError) {
    return (
      <Alert color="yellow" variant="light" title="Чернетку збережено, але не відправлено">
        {errorMessage(error.sendError)}{' '}
        <Anchor component={Link} to={`/staff/purchase-orders/${error.id}`}>Відкрити чернетку</Anchor>
      </Alert>
    )
  }
  return <Alert color="red" variant="light" title="Не вдалося створити замовлення">{errorMessage(error)}</Alert>
}
