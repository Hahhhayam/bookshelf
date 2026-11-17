import { Anchor } from '@mantine/core'
import { Link, useParams } from 'react-router'
import { fulfilmentLabel, orderStatus, orderTypeLabel, useOrder, type OrderCard, type OrderStatus } from '@/entities/order'
import { useLocationNames } from '@/entities/reference'
import { useCan } from '@/entities/viewer'
import { Perm, shortId } from '@/shared/lib'
import { MoneyText, QueryView } from '@/shared/ui'
import { DocumentCard, type Fact } from '@/widgets/document-card'
import { OrderActions } from './ui/OrderActions'
import { OrderLines } from './ui/OrderLines'

const statusLabel = (status: string) => orderStatus[status as OrderStatus]?.label ?? (status || 'Створено')

export default function OrderPage() {
  const { id } = useParams()
  const order = useOrder(id)
  return <QueryView query={order}>{(data) => <OrderDocument order={data} />}</QueryView>
}

function OrderDocument({ order }: { order: OrderCard }) {
  const facts = useOrderFacts(order)
  return (
    <DocumentCard
      crumb={{ label: 'Онлайн-замовлення', to: '/staff/orders' }}
      title={`Замовлення ${shortId(order.id)}`}
      status={orderStatus[order.status]}
      actions={<OrderActions order={order} />}
      facts={facts}
      tabs={[{ value: 'lines', label: 'Позиції', count: order.lines.length, content: <OrderLines order={order} /> }]}
      history={{ entries: order.history, label: statusLabel }}
    />
  )
}

function useOrderFacts(order: OrderCard): Fact[] {
  const can = useCan()
  const locationName = useLocationNames()
  const units = order.lines.reduce((sum, line) => sum + line.quantity, 0)
  const { kind, pickupLocation, deliveryAddress } = order.fulfilment
  const customer = can(Perm.CrmManage, Perm.SalesCreate)
    ? <Anchor component={Link} to={`/staff/customers/${order.customer}`}>{shortId(order.customer)}</Anchor>
    : shortId(order.customer)
  return [
    { label: 'Клієнт', value: customer },
    { label: 'Тип', value: orderTypeLabel[order.type] },
    { label: 'Отримання', value: fulfilmentLabel[kind] },
    { label: kind === 'Pickup' ? 'Місце видачі' : 'Адреса доставки', value: kind === 'Pickup' ? locationName(pickupLocation) : deliveryAddress ?? '—' },
    { label: 'Код видачі', value: order.pickupCode, mono: true },
    { label: 'Склад', value: locationName(order.stockLocation) },
    { label: 'Позицій / одиниць', value: `${order.lines.length} / ${units}` },
    { label: 'Сума', value: <MoneyText value={order.total} variant="strong" /> },
  ]
}
