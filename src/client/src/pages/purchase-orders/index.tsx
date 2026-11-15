import { Button, Stack } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { Link } from 'react-router'
import { type PurchaseOrderSummary } from '@/entities/purchase-order'
import { referenceName } from '@/entities/reference'
import { useCan, useViewer } from '@/entities/viewer'
import {
  applyClientFilter, isDefaultFilter, PurchaseOrderFilters, statusFilterLabel, useOrderListFilter, usePurchaseOrderList,
  type OrderListFilter,
} from '@/features/purchasing-order-filters'
import { Perm } from '@/shared/lib'
import { PageHeader, Panel, QueryView } from '@/shared/ui'
import { PurchaseOrderTable, purchaseOrderNumber } from '@/widgets/purchasing-order-list'
import { AllClosedState, NothingFoundState } from './ui/ListEmptyStates'

const haystack = (row: PurchaseOrderSummary) => `${purchaseOrderNumber(row.id)} ${referenceName('suppliers', row.supplier)}`

function supplierOptions(rows: readonly PurchaseOrderSummary[]) {
  return [...new Set(rows.map((row) => row.supplier))]
    .map((id) => ({ id, name: referenceName('suppliers', id) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'uk'))
}

/** Purchase orders: open ones first, overdue and problem rows stand out (ListStates artboard). */
export default function PurchaseOrdersPage() {
  const { filter, change, reset } = useOrderListFilter()
  const query = usePurchaseOrderList(filter.status, filter.overdue)
  const can = useCan()
  const viewer = useViewer().data
  const canCreate = can(Perm.PurchasingManage)
  const suppliers = supplierOptions(query.data ?? [])

  return (
    <Stack gap={22}>
      <PageHeader
        eyebrow={`Закупівлі${viewer ? ` · ${viewer.login}` : ''}`}
        title="Замовлення постачальникам"
        actions={canCreate && (
          <Button component={Link} to="/staff/purchase-orders/new" leftSection={<IconPlus size={16} />}>Нове замовлення</Button>
        )}
      />
      <PurchaseOrderFilters
        filter={filter}
        onChange={change}
        suppliers={suppliers}
        statusCount={query.data?.length}
        overdueCount={query.data?.filter((row) => row.isOverdue).length}
      />
      {query.isPending || query.isError
        ? <Panel><QueryView query={query} skeletonRows={7}>{() => null}</QueryView></Panel>
        : <OrderList rows={query.data} filter={filter} canCreate={canCreate}
            supplierName={filter.supplier ? referenceName('suppliers', filter.supplier) : undefined} onChange={change} onReset={reset} />}
    </Stack>
  )
}

function OrderList({ rows, filter, canCreate, supplierName, onChange, onReset }: {
  rows: readonly PurchaseOrderSummary[]
  filter: OrderListFilter
  canCreate: boolean
  supplierName?: string
  onChange: (patch: Partial<OrderListFilter>) => void
  onReset: () => void
}) {
  if (rows.length === 0 && isDefaultFilter(filter)) {
    return <AllClosedState canCreate={canCreate} onShowAll={() => onChange({ status: 'all' })} />
  }
  const shown = applyClientFilter(rows, filter, haystack)
  if (shown.length === 0) {
    return <NothingFoundState filter={filter} supplierName={supplierName} onChange={onChange} onReset={onReset} />
  }
  return (
    <PurchaseOrderTable
      rows={shown}
      footer={`Показано ${shown.length} з ${rows.length} · статус: ${statusFilterLabel(filter.status)} · сортування за останньою зміною`}
    />
  )
}
