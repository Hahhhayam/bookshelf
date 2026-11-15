import { Button, Stack } from '@mantine/core'
import { IconInbox } from '@tabler/icons-react'
import { useState } from 'react'
import { useOrders, type OrderSummary } from '@/entities/order'
import { useWorkingLocation } from '@/entities/viewer'
import { isWaitingTooLong } from '@/features/ops-order-status'
import { minutesSince, shortId } from '@/shared/lib'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { BoardToolbar, type BoardFilters } from './ui/BoardToolbar'
import { OrderBoard } from './ui/OrderBoard'
import { OrderList } from './ui/OrderList'

const isLate = (order: OrderSummary) => order.lastChangedAt !== null && isWaitingTooLong(order.status, minutesSince(order.lastChangedAt))

function matches(order: OrderSummary, filters: BoardFilters) {
  const text = filters.search.trim().toUpperCase()
  const found = !text || shortId(order.id).includes(text) || shortId(order.customer).includes(text) || order.id.toUpperCase().includes(text)
  return found && (!filters.lateOnly || isLate(order))
}

const initial: BoardFilters = { view: 'board', search: '', lateOnly: false, status: null }

export default function OrderBoardPage() {
  const location = useWorkingLocation()
  const [filters, setFilters] = useState(initial)
  const orders = useOrders(location?.id, filters.view === 'list' ? filters.status ?? undefined : undefined)
  const lateCount = (orders.data ?? []).filter(isLate).length
  const filtered = (orders.data ?? []).filter((order) => matches(order, filters))

  return (
    <Stack gap="lg">
      <PageHeader eyebrow={location?.name} title="Онлайн-замовлення" />
      <BoardToolbar filters={filters} lateCount={lateCount} onChange={setFilters} />
      <QueryView
        query={orders}
        isEmpty={() => filtered.length === 0}
        empty={<Panel><Empty filtered={(orders.data?.length ?? 0) > 0} onReset={() => setFilters({ ...initial, view: filters.view })} /></Panel>}
      >
        {() => (filters.view === 'board' ? <OrderBoard orders={filtered} /> : <OrderList orders={filtered} />)}
      </QueryView>
    </Stack>
  )
}

function Empty({ filtered, onReset }: { filtered: boolean; onReset: () => void }) {
  return filtered ? (
    <EmptyState title="За цими фільтрами — нічого" text="Змініть пошук або зніміть фільтр." actions={<Button variant="default" onClick={onReset}>Скинути фільтри</Button>} />
  ) : (
    <EmptyState icon={<IconInbox size={40} stroke={1.5} />} title="Замовлень немає" text="Нові онлайн-замовлення цього магазину з’являться тут автоматично." />
  )
}
