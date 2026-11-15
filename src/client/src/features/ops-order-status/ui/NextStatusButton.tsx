import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconArrowRight } from '@tabler/icons-react'
import { nextOrderStatus, orderStatus, type OrderStatus } from '@/entities/order'
import { errorMessage } from '@/shared/ui'
import { orderStepLabel } from '../model/orderSteps'
import { useChangeOrderStatus } from '../model/useChangeOrderStatus'

/** One click moves the order along its route (FR-08); nothing is shown once the route has ended. */
export function NextStatusButton({ id, status, compact = false }: { id: string; status: OrderStatus; compact?: boolean }) {
  const change = useChangeOrderStatus()
  const next = nextOrderStatus[status]
  const label = orderStepLabel[status]
  if (!next || !label) return null

  function move() {
    change.mutate({ id, status: next! }, {
      onSuccess: () => notifications.show({ color: 'green', message: `Статус: ${orderStatus[next!].label}` }),
      onError: (error) => notifications.show({ color: 'red', title: 'Статус не змінено', message: errorMessage(error) }),
    })
  }

  return (
    <Button
      variant={compact ? 'outline' : 'filled'}
      size={compact ? 'sm' : 'md'}
      fullWidth={compact}
      rightSection={<IconArrowRight size={14} stroke={1.75} />}
      loading={change.isPending}
      onClick={move}
    >
      {label}
    </Button>
  )
}
