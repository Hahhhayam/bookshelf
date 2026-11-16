import { ActionIcon, Anchor, Group, Menu, Stack, Text } from '@mantine/core'
import { IconClock, IconDots } from '@tabler/icons-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { cancellable, isWaitingTooLong, orderTypeLabel, type OrderSummary } from '@/entities/order'
import { CancelOrderDialog, NextStatusButton } from '@/features/ops-order-status'
import { statusTone, tokens } from '@/shared/config/tokens'
import { formatWaited, minutesSince, shortId } from '@/shared/lib'

/** One order on the board: number, customer, waiting time (amber when over the norm), the next step and a menu. */
export function OrderTile({ order }: { order: OrderSummary }) {
  const [cancelling, setCancelling] = useState(false)
  const number = shortId(order.id)
  const waited = minutesSince(order.lastChangedAt)
  const late = order.lastChangedAt !== null && isWaitingTooLong(order.status, waited)
  const attention = statusTone.attention

  return (
    <article
      style={{
        background: tokens.color.surface, border: `1px solid ${late ? attention.dot : tokens.color.line}`, padding: 14,
        boxShadow: late ? `inset 0 3px 0 ${attention.dot}` : tokens.shadow.e1,
      }}
    >
      <Stack gap={10}>
        <Group justify="space-between" wrap="nowrap">
          <Anchor component={Link} to={`/staff/orders/${order.id}`} ff="monospace" fw={600} size="sm">{number}</Anchor>
          <Menu position="bottom-end" width={220} shadow="md">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" aria-label={`Дії із замовленням ${number}`}><IconDots size={18} /></ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component={Link} to={`/staff/orders/${order.id}`}>Відкрити замовлення</Menu.Item>
              {cancellable(order.status) && (
                <>
                  <Menu.Divider />
                  <Menu.Item c="red" fw={600} onClick={() => setCancelling(true)}>Скасувати замовлення…</Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Stack gap={2}>
          <Text fw={600} fz={15}>Клієнт {shortId(order.customer)}</Text>
        </Stack>
        <Group gap={6}>
          <Text span size="xs" fw={500} px={6} style={{ background: tokens.color.paper, color: tokens.color.ink2 }}>
            {orderTypeLabel[order.type]}
          </Text>
          <Group
            gap={5} wrap="nowrap" fz="xs"
            style={late ? { color: attention.text, background: attention.bg, fontWeight: 700, padding: '2px 6px' } : { color: tokens.color.ink2 }}
          >
            <IconClock size={14} stroke={1.75} />
            {order.lastChangedAt === null ? 'без змін' : late ? `Чекає ${formatWaited(waited)}` : `${formatWaited(waited)} тому`}
          </Group>
        </Group>
        <NextStatusButton id={order.id} status={order.status} compact />
      </Stack>
      <CancelOrderDialog id={order.id} number={number} opened={cancelling} onClose={() => setCancelling(false)} />
    </article>
  )
}
