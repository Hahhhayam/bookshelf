import { Alert, Anchor, Stack, Text } from '@mantine/core'
import { Link } from 'react-router'
import { purchaseOrderStatus, usePurchaseOrder, type PurchaseOrderCard } from '@/entities/purchase-order'
import { referenceName } from '@/entities/reference'
import type { ReceivingLine } from '@/features/purchasing-receive-delivery'
import { formatDate } from '@/shared/lib'
import { QueryView } from '@/shared/ui'
import { purchaseOrderNumber } from '@/widgets/purchasing-order-list'
import { ReceivingWorkspace } from './ReceivingWorkspace'

const toLines = (order: PurchaseOrderCard): ReceivingLine[] =>
  order.lines.map((line) => ({ book: line.book, ordered: line.ordered, alreadyReceived: line.received, now: null }))

/** Receiving against a purchase order: its lines are the starting point. */
export function PlannedDelivery({ orderId, location, onDone }: { orderId: string; location: string; onDone: (id: string) => void }) {
  const query = usePurchaseOrder(orderId)
  return (
    <QueryView query={query}>
      {(order) => (
        <Stack gap={16}>
          <Text size="sm" c="dimmed">
            За замовленням{' '}
            <Anchor component={Link} to={`/staff/purchase-orders/${order.id}`} size="sm">{purchaseOrderNumber(order.id)}</Anchor>
            {' · '}{referenceName('suppliers', order.supplier)} · очікувалась {formatDate(order.expectedDate)}
          </Text>
          {order.status === 'Sent' || order.status === 'PartlyReceived'
            ? <ReceivingWorkspace key={order.id} initialLines={toLines(order)} planned location={location}
                order={order.id} supplier={order.supplier} onDone={onDone} />
            : (
              <Alert color="yellow" variant="light" title="Це замовлення не чекає на поставку">
                Статус: {purchaseOrderStatus[order.status].label}. Приймати можна лише відправлені постачальнику замовлення.
              </Alert>
            )}
        </Stack>
      )}
    </QueryView>
  )
}
