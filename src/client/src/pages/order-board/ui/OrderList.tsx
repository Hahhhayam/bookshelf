import { Anchor, Table } from '@mantine/core'
import { Link } from 'react-router'
import { orderStatus, orderTypeLabel, type OrderSummary } from '@/entities/order'
import { userNames } from '@/entities/reference'
import { useViewer } from '@/entities/viewer'
import { formatAgo, shortId } from '@/shared/lib'
import { Panel, StatusBadge } from '@/shared/ui'

/** The list view: every status, including issued and cancelled orders that leave the board. */
export function OrderList({ orders }: { orders: OrderSummary[] }) {
  const userName = userNames(useViewer().data)
  return (
    <Panel>
      <Table.ScrollContainer minWidth={640}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Номер</Table.Th>
              <Table.Th>Клієнт</Table.Th>
              <Table.Th>Тип</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Остання зміна</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((order) => (
              <Table.Tr key={order.id}>
                <Table.Td><Anchor component={Link} to={`/staff/orders/${order.id}`} ff="monospace" fw={600}>{shortId(order.id)}</Anchor></Table.Td>
                <Table.Td>{shortId(order.customer)}</Table.Td>
                <Table.Td>{orderTypeLabel[order.type]}</Table.Td>
                <Table.Td><StatusBadge {...orderStatus[order.status]} /></Table.Td>
                <Table.Td>{formatAgo(order.lastChangedAt)}{order.lastChangedBy && ` · ${userName(order.lastChangedBy)}`}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Panel>
  )
}
