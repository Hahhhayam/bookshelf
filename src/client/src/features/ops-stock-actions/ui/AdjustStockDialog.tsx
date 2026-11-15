import { notifications } from '@mantine/notifications'
import { useAdjustStock } from '../model/mutations'
import type { StockTarget } from '../model/types'
import { StockQuantityDialog } from './StockQuantityDialog'

/** Sets the counted on-hand quantity of one book; the reason goes to the audit log. */
export function AdjustStockDialog({ location, target, onClose }: { location: string; target: StockTarget | null; onClose: () => void }) {
  const adjust = useAdjustStock(location)
  if (!target) return null

  function close() {
    adjust.reset()
    onClose()
  }

  return (
    <StockQuantityDialog
      key={target.book}
      opened
      title="Коригування залишку"
      intro={<>«{target.title}»: зараз на складі {target.onHand} од. Вкажіть фактичну кількість.</>}
      quantityLabel="Фактично на складі"
      initial={target.onHand}
      confirmLabel="Зберегти залишок"
      pending={adjust.isPending}
      error={adjust.error}
      onClose={close}
      onSubmit={(newOnHand, reason) => adjust.mutate({ book: target.book, newOnHand, reason }, {
        onSuccess: () => { notifications.show({ color: 'green', message: 'Залишок скориговано' }); close() },
      })}
    />
  )
}
