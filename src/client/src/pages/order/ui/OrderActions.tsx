import { Button } from '@mantine/core'
import { useState } from 'react'
import { cancellable, type OrderCard } from '@/entities/order'
import { CancelOrderDialog, NextStatusButton } from '@/features/ops-order-status'
import { shortId } from '@/shared/lib'

export function OrderActions({ order }: { order: OrderCard }) {
  const [cancelling, setCancelling] = useState(false)
  return (
    <>
      {cancellable(order.status) && (
        <Button variant="default" c="red" onClick={() => setCancelling(true)}>Скасувати замовлення</Button>
      )}
      <NextStatusButton id={order.id} status={order.status} />
      <CancelOrderDialog id={order.id} number={shortId(order.id)} opened={cancelling} onClose={() => setCancelling(false)} />
    </>
  )
}
