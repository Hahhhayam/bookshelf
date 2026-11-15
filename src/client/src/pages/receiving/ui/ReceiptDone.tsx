import { Button } from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'
import { Link } from 'react-router'
import { shortId } from '@/shared/lib'
import { EmptyState, Panel } from '@/shared/ui'

/** The API cannot read a goods receipt back (GAP-20), so success shows the created id only. */
export function ReceiptDone({ receiptId, order, onNext }: { receiptId: string; order: string | null; onNext: () => void }) {
  return (
    <Panel>
      <EmptyState
        icon={<IconCircleCheck size={56} stroke={1.5} />}
        title="Поставку прийнято"
        text={`Приймання ПР-${shortId(receiptId)} записано, залишки складу оновлено.`}
        actions={(
          <>
            {order && <Button variant="default" component={Link} to={`/staff/purchase-orders/${order}`}>Відкрити замовлення</Button>}
            <Button onClick={onNext}>Прийняти наступну поставку</Button>
          </>
        )}
      />
    </Panel>
  )
}
