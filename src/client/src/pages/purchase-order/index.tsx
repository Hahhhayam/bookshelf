import { Anchor, Badge, Stack, Tabs } from '@mantine/core'
import { Link, useParams } from 'react-router'
import { purchaseOrderStatus, usePurchaseOrder, type PurchaseOrderStatus } from '@/entities/purchase-order'
import { useUserNames } from '@/entities/reference'
import { HistoryTimeline, Panel, QueryView } from '@/shared/ui'
import { OrderFacts } from './ui/OrderFacts'
import { OrderHeader } from './ui/OrderHeader'
import { OrderLinesTable } from './ui/OrderLinesTable'

const statusLabel = (status: string) => purchaseOrderStatus[status as PurchaseOrderStatus]?.label ?? status

/** A purchase order card (Document artboard): header with actions, facts, lines and history. */
export default function PurchaseOrderPage() {
  const { id } = useParams()
  const query = usePurchaseOrder(id)
  const userName = useUserNames()

  return (
    <Stack gap={20}>
      <Anchor component={Link} to="/staff/purchase-orders" size="sm">← Замовлення постачальникам</Anchor>
      <QueryView query={query}>
        {(order) => (
          <Stack gap={20}>
            <OrderHeader order={order} />
            <OrderFacts order={order} />
            <Panel>
              <Tabs defaultValue="lines">
                <Tabs.List px="md">
                  <Tabs.Tab value="lines" rightSection={<Badge variant="light" color="gray" size="sm">{order.lines.length}</Badge>}>
                    Позиції
                  </Tabs.Tab>
                  <Tabs.Tab value="history" rightSection={<Badge variant="light" color="gray" size="sm">{order.history.length}</Badge>}>
                    Історія
                  </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="lines"><OrderLinesTable order={order} /></Tabs.Panel>
                <Tabs.Panel value="history" p="lg">
                  <HistoryTimeline entries={order.history} label={statusLabel} userName={userName} />
                </Tabs.Panel>
              </Tabs>
            </Panel>
          </Stack>
        )}
      </QueryView>
    </Stack>
  )
}
