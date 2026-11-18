import { Group, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router'
import { orderStatus, useCustomerOrders, type CustomerOrder } from '@/entities/order'
import { storeName, useStores } from '@/entities/store'
import { tokens } from '@/shared/config/tokens'
import { plural } from '@/shared/lib'
import { MoneyText, QueryView, StatusBadge } from '@/shared/ui'

const kindLabel = { Pickup: 'Самовивіз', Delivery: 'Доставка' } as const
const bookForms = ['книжка', 'книжки', 'книжок'] as const

/** The shopper's own orders, newest first; each opens its tracking page by the pickup code. */
export function MyOrders({ customer }: { customer: string }) {
  const orders = useCustomerOrders(customer)
  return (
    <Stack gap="sm" component="section" aria-labelledby="my-orders">
      <Title id="my-orders" order={2} fz={22}>Мої замовлення</Title>
      <QueryView query={orders} skeletonRows={3}>
        {(list) => list.length === 0
          ? <Text size="md" c={tokens.color.ink2}>Замовлень ще немає.</Text>
          : <Stack gap="xs">{list.map((order) => <OrderRow key={order.id} order={order} />)}</Stack>}
      </QueryView>
    </Stack>
  )
}

function OrderRow({ order }: { order: CustomerOrder }) {
  const stores = useStores().data
  const status = orderStatus[order.status]
  return (
    <Link to={`/track/${encodeURIComponent(order.pickupCode)}`} style={{ color: 'inherit', textDecoration: 'none' }}>
      <Group justify="space-between" gap="sm" p="md"
        style={{ border: `1px solid ${tokens.color.line}`, background: tokens.color.surface }}>
      <Stack gap={2}>
        <Text fw={600}>{kindLabel[order.kind]}{order.store && ` · ${storeName(stores, order.store)}`}</Text>
        <Group gap="xs" fz={15} c={tokens.color.ink2}>
          <Text span fz={15}>{order.quantity} {plural(order.quantity, bookForms)}</Text>
          <Text span fz={15}>·</Text>
          <MoneyText value={order.total} />
        </Group>
      </Stack>
      <StatusBadge tone={status.tone} label={status.label} />
      </Group>
    </Link>
  )
}
