import { Anchor, Table } from '@mantine/core'
import { Link } from 'react-router'
import { useDeliveries, type GoodsReceiptSummary } from '@/entities/purchase-order'
import { useReferenceNames } from '@/entities/reference'
import { formatDateTime, shortId } from '@/shared/lib'
import { EmptyState, Panel, QueryView, StatusBadge } from '@/shared/ui'

/** Deliveries already received at this location, newest first; a receipt with discrepancies stands out. */
export function RecentReceipts({ location }: { location: string }) {
  const receipts = useDeliveries(location)
  return (
    <Panel title="Прийняті поставки">
      <QueryView
        query={receipts}
        isEmpty={(data) => data.length === 0}
        empty={<EmptyState title="Поставок ще не приймали" text="Тут з’являться документи приймання цієї локації." />}
      >
        {(data) => <ReceiptTable rows={data} />}
      </QueryView>
    </Panel>
  )
}

function ReceiptTable({ rows }: { rows: GoodsReceiptSummary[] }) {
  const supplierName = useReferenceNames('suppliers')
  return (
    <Table.ScrollContainer minWidth={640}>
      <Table highlightOnHover verticalSpacing={10} horizontalSpacing={12}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Номер</Table.Th>
            <Table.Th>Прийнято</Table.Th>
            <Table.Th>Постачальник</Table.Th>
            <Table.Th>Підстава</Table.Th>
            <Table.Th ta="right">Одиниць</Table.Th>
            <Table.Th>Стан</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>
                <Anchor component={Link} to={`/staff/receiving/${row.id}`} ff="monospace" fw={600}>{shortId(row.id)}</Anchor>
              </Table.Td>
              <Table.Td>{formatDateTime(row.confirmedAt)}</Table.Td>
              <Table.Td>{supplierName(row.supplier)}</Table.Td>
              <Table.Td>{row.purchaseOrder ? 'Замовлення постачальнику' : 'Незапланована'}</Table.Td>
              <Table.Td ta="right">{row.receivedUnits}</Table.Td>
              <Table.Td>
                {row.hasDiscrepancies ? <StatusBadge tone="problem" label="Розбіжності" /> : <StatusBadge tone="done" label="Без розбіжностей" />}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
