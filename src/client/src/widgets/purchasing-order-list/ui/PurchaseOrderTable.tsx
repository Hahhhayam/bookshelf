import { Anchor, Stack, Table, Text } from '@mantine/core'
import { IconAlertTriangle, IconClockHour4 } from '@tabler/icons-react'
import { Link } from 'react-router'
import { purchaseOrderStatus, type PurchaseOrderSummary } from '@/entities/purchase-order'
import { referenceName } from '@/entities/reference'
import { statusTone, tokens } from '@/shared/config/tokens'
import { formatDate } from '@/shared/lib'
import { MoneyText, StatusBadge } from '@/shared/ui'
import { overdueText, purchaseOrderNumber } from '../lib/labels'
import { useOrderTotals } from '../model/useOrderTotals'
import { LastChange } from './LastChange'

type RowKind = 'overdue' | 'problem' | 'normal'

function rowKind(row: PurchaseOrderSummary): RowKind {
  if (row.isOverdue) return 'overdue'
  return purchaseOrderStatus[row.status].tone === 'problem' ? 'problem' : 'normal'
}

const rowBackground: Record<RowKind, string | undefined> = {
  overdue: `color-mix(in srgb, ${statusTone.attention.bg} 40%, ${tokens.color.surface})`,
  problem: `color-mix(in srgb, ${statusTone.problem.bg} 40%, ${tokens.color.surface})`,
  normal: undefined,
}

/** The purchase order list: overdue rows amber, problem rows red, newest change first. */
export function PurchaseOrderTable({ rows, footer }: { rows: readonly PurchaseOrderSummary[]; footer?: string }) {
  const total = useOrderTotals(rows.map((row) => row.id))
  return (
    <div style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}>
      <Table.ScrollContainer minWidth={880}>
        <Table verticalSpacing={12} horizontalSpacing={12}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={28} />
              <Table.Th>Номер</Table.Th>
              <Table.Th>Постачальник</Table.Th>
              <Table.Th ta="right">Сума</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Очікувана поставка</Table.Th>
              <Table.Th>Остання зміна</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => <OrderRow key={row.id} row={row} total={total(row.id)} />)}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {footer && (
        <Text size="sm" c="dimmed" px="md" py={10} style={{ borderTop: `1px solid ${tokens.color.line}` }}>{footer}</Text>
      )}
    </div>
  )
}

function OrderRow({ row, total }: { row: PurchaseOrderSummary; total: ReturnType<ReturnType<typeof useOrderTotals>> }) {
  const kind = rowKind(row)
  const status = purchaseOrderStatus[row.status]
  return (
    <Table.Tr style={{ background: rowBackground[kind] }}>
      <Table.Td pr={0}><RowIcon kind={kind} /></Table.Td>
      <Table.Td>
        <Stack gap={3}>
          <Anchor component={Link} to={`/staff/purchase-orders/${row.id}`} fw={600} underline="never">
            {purchaseOrderNumber(row.id)}
          </Anchor>
          {kind === 'overdue' && <Text fz={12} fw={600} c={statusTone.attention.text}>{overdueText(row.expectedDate)}</Text>}
        </Stack>
      </Table.Td>
      <Table.Td>{referenceName('suppliers', row.supplier)}</Table.Td>
      <Table.Td ta="right" fw={600}>{total ? <MoneyText value={total} /> : <Text span c="dimmed">…</Text>}</Table.Td>
      <Table.Td><StatusBadge tone={status.tone} label={status.label} /></Table.Td>
      <Table.Td style={{ whiteSpace: 'nowrap', color: row.isOverdue ? statusTone.attention.text : undefined, fontWeight: row.isOverdue ? 600 : undefined }}>
        {formatDate(row.expectedDate)}
      </Table.Td>
      <Table.Td><LastChange at={row.lastChangedAt} by={row.lastChangedBy} /></Table.Td>
    </Table.Tr>
  )
}

function RowIcon({ kind }: { kind: RowKind }) {
  if (kind === 'overdue') {
    return <IconClockHour4 size={18} stroke={1.75} color={statusTone.attention.dot} role="img" aria-label="Прострочено" style={{ display: 'block' }} />
  }
  if (kind === 'problem') {
    return <IconAlertTriangle size={18} stroke={1.75} color={statusTone.problem.dot} role="img" aria-label="Проблема" style={{ display: 'block' }} />
  }
  return null
}
