import { Button, Flex, Stack } from '@mantine/core'
import { IconReceiptOff } from '@tabler/icons-react'
import { Link, useParams } from 'react-router'
import { ApiError } from '@/shared/api'
import { useTrackedOrder, type TrackedOrder } from '@/entities/order'
import { EmptyState, QueryView } from '@/shared/ui'
import { PickupCodeCard } from './ui/PickupCodeCard'
import { PlacedLines } from './ui/PlacedLines'

/** Confirmation (artboards ShopConfirm, ShopMobile d): the placed order read back by its pickup code. */
export default function ShopOrderPlacedPage() {
  const { code } = useParams()
  const order = useTrackedOrder(code)
  if (!code || (order.error instanceof ApiError && order.error.status === 404)) return <NotFound />
  return <QueryView query={order}>{(placed) => <Placed order={placed} code={code} />}</QueryView>
}

function Placed({ order, code }: { order: TrackedOrder; code: string }) {
  return (
    <Flex gap={40} direction={{ base: 'column', md: 'row' }} align="flex-start" maw={1080} mx="auto">
      <Stack style={{ flex: 1, minWidth: 0, width: '100%' }}>
        <PickupCodeCard order={order} code={code} />
      </Stack>
      <PlacedLines order={order} />
    </Flex>
  )
}

function NotFound() {
  return (
    <EmptyState
      icon={<IconReceiptOff size={48} stroke={1.5} />}
      title="Замовлення не знайдено"
      text="Перевірте код отримання — стан замовлення можна знайти за ним."
      actions={<Button component={Link} to="/track">Відстежити замовлення</Button>}
    />
  )
}
