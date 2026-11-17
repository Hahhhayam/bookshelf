import { Alert, Button, Group, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { useOpenShift } from '@/entities/sale'
import { useCan } from '@/entities/viewer'
import { formatDateTime, Perm } from '@/shared/lib'
import { ConfirmDialog, errorMessage, StatusBadge } from '@/shared/ui'
import { useShiftActions } from '../model/useShiftActions'

/** Whether the store's till is open; a user with the shift right opens or closes it. */
export function ShiftControl({ locationId }: { locationId: string }) {
  const can = useCan()
  const shift = useOpenShift(locationId)
  const { open, close } = useShiftActions(locationId)
  const [closing, setClosing] = useState(false)
  const manage = can(Perm.ShiftsManage)
  const current = shift.data
  const error = open.error ?? close.error ?? shift.error

  return (
    <Stack gap="xs">
      <Group gap="sm">
        {current?.open
          ? <StatusBadge tone="ready" label={`Зміна відкрита з ${formatDateTime(current.openedAt)}`} />
          : <StatusBadge tone="draft" label={shift.isPending ? 'Перевіряємо зміну…' : 'Каса закрита'} />}
        {manage && current && !current.open && (
          <Button size="xs" loading={open.isPending} onClick={() => open.mutate()}>Відкрити зміну</Button>
        )}
        {manage && current?.open && (
          <Button size="xs" variant="default" onClick={() => setClosing(true)}>Закрити зміну</Button>
        )}
      </Group>
      {current && !current.open && !manage && (
        <Text fz={13} c="dimmed">Продаж можливий лише у відкриту зміну — її відкриває адміністратор магазину.</Text>
      )}
      {error && <Alert color="red" variant="light" p="xs">{errorMessage(error)}</Alert>}
      <ConfirmDialog opened={closing} title="Закрити зміну?" confirmLabel="Закрити зміну" loading={close.isPending}
        onClose={() => setClosing(false)}
        onConfirm={() => current?.id && close.mutate(current.id, { onSettled: () => setClosing(false) })}>
        <Text>Після закриття каса магазину не прийматиме продажі, доки зміну не відкриють знову.</Text>
      </ConfirmDialog>
    </Stack>
  )
}
