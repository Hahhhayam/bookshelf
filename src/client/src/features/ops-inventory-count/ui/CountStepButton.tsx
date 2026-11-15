import { Button, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { useCan } from '@/entities/viewer'
import { Perm } from '@/shared/lib'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { useCountStep, type CountStatus } from '../model/counts'

const steps = {
  complete: {
    from: 'Open', perm: Perm.InventoryCountManage, label: 'Завершити перерахунок',
    title: 'Завершити перерахунок?', confirm: 'Завершити', done: 'Перерахунок завершено',
  },
  approve: {
    from: 'Counted', perm: Perm.InventoryCountApprove, label: 'Затвердити',
    title: 'Затвердити інвентаризацію?', confirm: 'Затвердити', done: 'Інвентаризацію затверджено',
  },
} as const

/** Complete (inventory.count) and then approve (inventory.approve): the button for the step the count is at. */
export function CountStepButton({ id, status, uncounted, differences }: {
  id: string
  status: CountStatus
  uncounted: number
  differences: number
}) {
  const can = useCan()
  const kind = status === 'Open' ? 'complete' : 'approve'
  const step = steps[kind]
  const [opened, setOpened] = useState(false)
  const mutation = useCountStep(id, kind)
  if (step.from !== status || !can(step.perm)) return null

  function close() {
    mutation.reset()
    setOpened(false)
  }

  return (
    <>
      <Button onClick={() => setOpened(true)}>{step.label}</Button>
      <ConfirmDialog
        opened={opened}
        title={step.title}
        confirmLabel={step.confirm}
        loading={mutation.isPending}
        onConfirm={() => mutation.mutate(undefined, {
          onSuccess: () => { notifications.show({ color: 'green', message: step.done }); setOpened(false) },
        })}
        onClose={close}
      >
        {kind === 'complete' ? (
          <Text size="md">
            Записи перерахунку буде закрито. {uncounted > 0 && <strong>Ще не пораховано позицій: {uncounted}. </strong>}
            Після завершення інвентаризацію затверджує користувач із правом затвердження.
          </Text>
        ) : (
          <Text size="md">
            Залишки буде змінено на пораховані кількості. Позицій із різницею: {differences}. Скасувати затвердження не можна.
          </Text>
        )}
        {mutation.isError && <Text size="sm" c="red" mt="sm">{errorMessage(mutation.error)}</Text>}
      </ConfirmDialog>
    </>
  )
}
