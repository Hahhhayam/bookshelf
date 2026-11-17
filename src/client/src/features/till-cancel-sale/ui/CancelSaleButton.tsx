import { Alert, Button, Text } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { saleApi, saleKeys } from '@/entities/sale'
import { useCan } from '@/entities/viewer'
import type { Money } from '@/shared/api'
import { formatMoney, Perm, shortId } from '@/shared/lib'
import { ConfirmDialog, errorMessage } from '@/shared/ui'

/** Cancelling a posted receipt: only with the cancel right (table 2.1); the books go back to stock. */
export function CancelSaleButton({ sale, total }: { sale: string; total: Money }) {
  const can = useCan()
  const client = useQueryClient()
  const [opened, setOpened] = useState(false)
  const cancel = useMutation({
    mutationFn: () => saleApi.cancel(sale),
    onSuccess: async () => {
      setOpened(false)
      await client.invalidateQueries({ queryKey: saleKeys.all })
    },
  })
  if (!can(Perm.SalesCancel)) return null

  return (
    <>
      <Button size="xs" variant="subtle" color="red" onClick={() => setOpened(true)}>Анулювати</Button>
      <ConfirmDialog opened={opened} title="Анулювати чек?" confirmLabel="Анулювати чек" danger loading={cancel.isPending}
        onClose={() => { setOpened(false); cancel.reset() }} onConfirm={() => cancel.mutate()}>
        <Text>Чек {shortId(sale)} на {formatMoney(total)} буде анульовано, книги повернуться на залишок. Скасувати це не можна.</Text>
        {cancel.isError && <Alert color="red" variant="light" mt="sm">{errorMessage(cancel.error)}</Alert>}
      </ConfirmDialog>
    </>
  )
}
