import { Button } from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'
import { Link } from 'react-router'
import { EmptyState, Panel } from '@/shared/ui'

export function ReceiptDone({ receipt, order, onNext }: { receipt: string; order: string | null; onNext: () => void }) {
  return (
    <Panel>
      <EmptyState
        icon={<IconCircleCheck size={56} stroke={1.5} />}
        title="Поставку прийнято"
        text="Приймання записано, залишки складу оновлено."
        actions={(
          <>
            <Button variant="default" component={Link} to={`/staff/receiving/${receipt}`}>Документ приймання</Button>
            {order && <Button variant="default" component={Link} to={`/staff/purchase-orders/${order}`}>Відкрити замовлення</Button>}
            <Button onClick={onNext}>Прийняти наступну поставку</Button>
          </>
        )}
      />
    </Panel>
  )
}
