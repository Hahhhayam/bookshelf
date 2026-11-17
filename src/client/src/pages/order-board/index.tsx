import { Button, Stack } from '@mantine/core'
import { IconInbox } from '@tabler/icons-react'
import { useState } from 'react'
import { useOrders } from '@/entities/order'
import { useWorkingLocation } from '@/entities/viewer'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { initialFilters, isLate, matches, pickupCodeOf } from './model/filters'
import { BoardToolbar } from './ui/BoardToolbar'
import { OrderBoard } from './ui/OrderBoard'
import { OrderList } from './ui/OrderList'

/** A pickup code finds its order in any status, so the result is shown as a list even on the board view. */
export default function OrderBoardPage() {
  const location = useWorkingLocation()
  const [filters, setFilters] = useState(initialFilters)
  const pickupCode = pickupCodeOf(filters.search)
  const status = filters.view === 'list' && !pickupCode ? filters.status ?? undefined : undefined
  const orders = useOrders(location?.id, status, pickupCode)
  const lateCount = (orders.data ?? []).filter(isLate).length
  const filtered = (orders.data ?? []).filter((order) => matches(order, filters))
  const asList = filters.view === 'list' || !!pickupCode

  return (
    <Stack gap="lg">
      <PageHeader eyebrow={location?.name} title="Онлайн-замовлення" />
      <BoardToolbar filters={filters} lateCount={lateCount} onChange={setFilters} />
      <QueryView
        query={orders}
        isEmpty={() => filtered.length === 0}
        empty={<Panel><Empty filtered={(orders.data?.length ?? 0) > 0 || !!pickupCode} onReset={() => setFilters({ ...initialFilters, view: filters.view })} /></Panel>}
      >
        {() => (asList ? <OrderList orders={filtered} /> : <OrderBoard orders={filtered} />)}
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
