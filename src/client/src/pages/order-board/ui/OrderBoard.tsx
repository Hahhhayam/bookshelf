import { Group, Stack, Text } from '@mantine/core'
import { orderStatus, type OrderStatus, type OrderSummary } from '@/entities/order'
import { statusTone, tokens } from '@/shared/config/tokens'
import { OrderTile } from './OrderTile'

const columns: OrderStatus[] = ['New', 'Confirmed', 'Picking', 'Ready']

/** One column per open status; the board scrolls sideways on narrow screens. */
export function OrderBoard({ orders }: { orders: OrderSummary[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(260px, 1fr))', gap: 16, minHeight: 480 }}>
        {columns.map((status) => {
          const cards = orders.filter((order) => order.status === status)
          return (
            <section key={status} aria-label={orderStatus[status].label} style={{ background: tokens.color.sunk, minWidth: 0 }}>
              <Group gap={10} px={14} pt={14} pb={10}>
                <span style={{ width: 10, height: 10, background: statusTone[orderStatus[status].tone].dot }} />
                <Text fw={700} size="md">{orderStatus[status].label}</Text>
                <Text span size="xs" fw={600} px={6} style={{ background: tokens.color.surface, color: tokens.color.ink2 }}>{cards.length}</Text>
              </Group>
              <Stack gap={10} px={10} pb={12}>
                {cards.map((order) => <OrderTile key={order.id} order={order} />)}
                {cards.length === 0 && <Text size="sm" c="dimmed" ta="center" py="md">Немає замовлень</Text>}
              </Stack>
            </section>
          )
        })}
      </div>
    </div>
  )
}
