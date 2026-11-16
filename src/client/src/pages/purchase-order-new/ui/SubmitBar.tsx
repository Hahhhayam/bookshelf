import { Alert, Button, Group } from '@mantine/core'
import { Link } from 'react-router'
import { errorMessage } from '@/shared/ui'

/** Saves the order as a draft; it goes to the supplier from its card. */
export function SubmitBar({ pending, error, onSubmit }: { pending: boolean; error: unknown; onSubmit: () => void }) {
  return (
    <>
      {error !== null && error !== undefined && (
        <Alert color="red" variant="light" title="Не вдалося створити замовлення">{errorMessage(error)}</Alert>
      )}
      <Group justify="flex-end" gap="sm">
        <Button component={Link} to="/staff/purchase-orders" variant="subtle" color="gray">Скасувати</Button>
        <Button loading={pending} onClick={onSubmit}>Зберегти чернетку</Button>
      </Group>
    </>
  )
}
