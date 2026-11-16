import { notifications } from '@mantine/notifications'
import { shortId } from '@/shared/lib'
import { useWriteOff } from '../model/mutations'
import type { StockTarget } from '../model/types'
import { StockQuantityDialog } from './StockQuantityDialog'

export function WriteOffDialog({ location, target, onClose }: { location: string; target: StockTarget | null; onClose: () => void }) {
  const writeOff = useWriteOff(location)
  if (!target) return null

  function close() {
    writeOff.reset()
    onClose()
  }

  return (
    <StockQuantityDialog
      key={target.book}
      opened
      title="Списання"
      intro={<>«{target.title}»: доступно {target.available} од. Списані книжки зникнуть із залишку, скасувати списання не можна.</>}
      quantityLabel="Кількість до списання"
      initial={1}
      max={target.available}
      confirmLabel="Списати"
      danger
      pending={writeOff.isPending}
      error={writeOff.error}
      onClose={close}
      onSubmit={(quantity, reason) => writeOff.mutate({ book: target.book, quantity, reason }, {
        onSuccess: (created) => {
          const id = created && typeof created === 'object' && 'id' in created ? String(created.id) : null
          notifications.show({ color: 'green', message: id ? `Акт списання ${shortId(id)} створено` : 'Списано' })
          close()
        },
      })}
    />
  )
}
