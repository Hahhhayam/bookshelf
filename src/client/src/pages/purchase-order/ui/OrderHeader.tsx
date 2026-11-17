import { Alert, Button, Group, Stack, Text, Title } from '@mantine/core'
import { IconClockHour4, IconTruckDelivery } from '@tabler/icons-react'
import { Link } from 'react-router'
import { purchaseOrderStatus, type PurchaseOrderCard } from '@/entities/purchase-order'
import { useReferenceNames, useUserNames } from '@/entities/reference'
import { useCan } from '@/entities/viewer'
import { CancelOrderButton } from '@/features/purchasing-cancel-order'
import { SendOrderButton } from '@/features/purchasing-send-order'
import { Perm, formatAgo, overdueText } from '@/shared/lib'
import { StatusBadge } from '@/shared/ui'

/** Status, last change and the actions the status and the user's rights allow. */
export function OrderHeader({ order }: { order: PurchaseOrderCard }) {
  const supplierNameOf = useReferenceNames('suppliers')
  const can = useCan()
  const userName = useUserNames()
  const status = purchaseOrderStatus[order.status]
  const last = order.history.at(-1)
  const awaitingDelivery = order.status === 'Sent' || order.status === 'PartlyReceived'
  const cancellable = (order.status === 'Draft' || order.status === 'Sent') && can(Perm.PurchasingManage)
  const supplierName = supplierNameOf(order.supplier)

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
        <Stack gap={8}>
          <Group gap={12} wrap="wrap">
            <Title order={1}>Замовлення постачальнику</Title>
            <StatusBadge tone={status.tone} label={status.label} />
          </Group>
          <Text size="sm" c="dimmed">
            {last ? `Остання зміна: ${formatAgo(last.at)} · ${userName(last.by)}` : 'Змін ще не було'}
          </Text>
        </Stack>
        <Group gap={10} wrap="wrap">
          {order.status === 'Draft' && can(Perm.PurchasingManage) && (
            <SendOrderButton orderId={order.id} supplierName={supplierName} />
          )}
          {cancellable && <CancelOrderButton orderId={order.id} supplierName={supplierName} />}
          {awaitingDelivery && can(Perm.ReceivingConfirm) && (
            <Button component={Link} to={`/staff/receiving?order=${order.id}`} leftSection={<IconTruckDelivery size={16} />}>
              Прийняти поставку
            </Button>
          )}
        </Group>
      </Group>
      {order.isOverdue && (
        <Alert color="yellow" variant="light" icon={<IconClockHour4 size={18} />} title={overdueText(order.expectedDate)} />
      )}
    </Stack>
  )
}
