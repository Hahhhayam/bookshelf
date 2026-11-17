import { Group, Stack, Text, Title } from '@mantine/core'
import { IconSearchOff } from '@tabler/icons-react'
import { ApiError } from '@/shared/api'
import { orderStatus, useTrackedOrder, type TrackedOrder } from '@/entities/order'
import { storeName, useStores } from '@/entities/store'
import { statusTone, tokens } from '@/shared/config/tokens'
import { plural } from '@/shared/lib'
import { EmptyState, MoneyText, QueryView, StatusBadge } from '@/shared/ui'
import { TrackTimeline } from './TrackTimeline'

const kindLabel = { Pickup: 'Самовивіз', Delivery: 'Доставка' } as const
const bookForms = ['книжка', 'книжки', 'книжок'] as const

export function TrackResult({ code }: { code: string }) {
  const tracked = useTrackedOrder(code)
  if (tracked.error instanceof ApiError && tracked.error.status === 404) {
    return (
      <EmptyState icon={<IconSearchOff size={44} stroke={1.5} />} title={`Замовлення з кодом ${code} не знайдено`}
        text="Перевірте код: він складається з літер і цифр, як на сторінці підтвердження." />
    )
  }
  return <QueryView query={tracked} skeletonRows={5}>{(order) => <TrackedCard order={order} />}</QueryView>
}

function TrackedCard({ order }: { order: TrackedOrder }) {
  const status = orderStatus[order.status]
  return (
    <Stack component="section" aria-labelledby="track-status" gap="lg" p={{ base: 'md', sm: 28 }}
      style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}>
      <Group justify="space-between" align="flex-end" gap="sm">
        <Stack gap={4}>
          <Text size="md" c={tokens.color.ink2}>Замовлення · {kindLabel[order.kind]}</Text>
          <Title id="track-status" order={2} fz={26} c={statusTone[status.tone].text}>{status.label}</Title>
        </Stack>
        <StatusBadge tone={status.tone} label={status.label} />
      </Group>
      <OrderContents order={order} />
      <TrackTimeline order={order} />
    </Stack>
  )
}

/** «3 книжки · Магазин на Хрещатику · 900 ₴»: what was ordered, where to collect it and the total. */
function OrderContents({ order }: { order: TrackedOrder }) {
  const stores = useStores().data
  const count = order.lines.reduce((sum, line) => sum + line.quantity, 0)
  return (
    <Group gap="xs" fz={15} c={tokens.color.ink2}>
      <Text span fz={15}>{count} {plural(count, bookForms)}</Text>
      {order.store && <Text span fz={15}>· {storeName(stores, order.store)}</Text>}
      <Text span fz={15}>·</Text>
      <MoneyText value={order.total} />
    </Group>
  )
}
