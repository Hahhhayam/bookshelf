import { Alert, Button, Group, Stack, Text, Title } from '@mantine/core'
import { IconClockHour4, IconTruckDelivery } from '@tabler/icons-react'
import { Link } from 'react-router'
import { purchaseOrderStatus, type PurchaseOrderCard } from '@/entities/purchase-order'
import { referenceName } from '@/entities/reference'
import { useCan } from '@/entities/viewer'
import { SendOrderButton } from '@/features/purchasing-send-order'
import { Perm, formatAgo } from '@/shared/lib'
import { StatusBadge } from '@/shared/ui'
import { overdueText, purchaseOrderNumber, useUserLabel } from '@/widgets/purchasing-order-list'

/** Number, status, last change and the actions the status and the user's rights allow. */
export function OrderHeader({ order }: { order: PurchaseOrderCard }) {
  const can = useCan()
  const userLabel = useUserLabel()
  const status = purchaseOrderStatus[order.status]
  const number = purchaseOrderNumber(order.id)
  const last = order.history.at(-1)
  const awaitingDelivery = order.status === 'Sent' || order.status === 'PartlyReceived'

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
        <Stack gap={8}>
          <Group gap={12} wrap="wrap">
            <Title order={1}>Замовлення {number}</Title>
            <StatusBadge tone={status.tone} label={status.label} />
          </Group>
          <Text size="sm" c="dimmed">
            {last ? `Остання зміна: ${formatAgo(last.at)} · ${userLabel(last.by)}` : 'Чернетка ще не відправлялась'}
          </Text>
        </Stack>
        <Group gap={10} wrap="wrap">
          {order.status === 'Draft' && can(Perm.PurchasingManage) && (
            <SendOrderButton orderId={order.id} number={number} supplierName={referenceName('suppliers', order.supplier)} />
          )}
          {awaitingDelivery && can(Perm.ReceivingConfirm) && (
            <Button component={Link} to={`/staff/receiving?order=${order.id}`} leftSection={<IconTruckDelivery size={16} />}>
              Прийняти поставку
            </Button>
          )}
        </Group>
      </Group>
      {order.isOverdue && (
        <Alert color="yellow" variant="light" icon={<IconClockHour4 size={18} />} title={overdueText(order.expectedDate)}>
          Поставку чекали до дати в замовленні. Зв’яжіться з постачальником і уточніть нову дату.
        </Alert>
      )}
    </Stack>
  )
}
