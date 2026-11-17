import { Table, Text } from '@mantine/core'
import { IconReceipt } from '@tabler/icons-react'
import { useState } from 'react'
import { saleStatusLabel, useOpenShift, useSales } from '@/entities/sale'
import { useCan, useViewer } from '@/entities/viewer'
import { CancelSaleButton } from '@/features/till-cancel-sale'
import { uah } from '@/shared/api'
import { tokens } from '@/shared/config/tokens'
import { Perm, shortId } from '@/shared/lib'
import { EmptyState, MoneyText, Panel, QueryView, StatusBadge } from '@/shared/ui'

const time = new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' })

function receiptsWord(n: number) {
  const last = n % 10
  const teen = n % 100 >= 11 && n % 100 <= 14
  return last === 1 && !teen ? 'чек' : last >= 2 && last <= 4 && !teen ? 'чеки' : 'чеків'
}

function startOfToday() {
  const day = new Date()
  day.setHours(0, 0, 0, 0)
  return day.toISOString()
}

/**
 * Receipts since the shift opened (or since midnight while the till is closed). A cashier sees their own; a user who
 * may cancel receipts sees the whole store's, to find the one to cancel.
 */
export function ShiftReceiptsTable({ locationId }: { locationId: string }) {
  const can = useCan()
  const viewer = useViewer().data
  const allCashiers = can(Perm.SalesCancel)
  const shift = useOpenShift(locationId).data
  const [today] = useState(startOfToday)
  const from = shift?.open && shift.openedAt ? shift.openedAt : today
  const query = useSales(locationId, from, allCashiers ? null : viewer?.id ?? null)
  const receipts = (query.data ?? []).filter((r) => r.status === 'Completed')
  const sum = receipts.reduce((s, r) => s + Math.round(r.total.amount * 100), 0) / 100
  return (
    <Panel title={allCashiers ? 'Чеки зміни' : 'Мої чеки за зміну'}
      extra={receipts.length > 0 && <Text fz={14} c={tokens.color.ink2}>{receipts.length} {receiptsWord(receipts.length)} · <MoneyText value={uah(sum)} /></Text>}>
      <QueryView query={query} skeletonRows={4} isEmpty={(items) => items.length === 0}
        empty={<EmptyState icon={<IconReceipt size={36} stroke={1.75} />} title="Чеків ще немає"
          text="Проведені на касі чеки цієї зміни з’являться тут." />}>
        {(items) => (
          <Table.ScrollContainer minWidth={640}>
            <Table verticalSpacing={11}>
              <Table.Thead>
                <Table.Tr><Table.Th>Чек</Table.Th><Table.Th>Час</Table.Th><Table.Th>Статус</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Сума</Table.Th><Table.Th /></Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((r) => (
                  <Table.Tr key={r.id}>
                    <Table.Td ff="monospace" fz={13}>{shortId(r.id)}</Table.Td>
                    <Table.Td>{time.format(new Date(r.completedAt))}</Table.Td>
                    <Table.Td>
                      <StatusBadge tone={r.status === 'Completed' ? 'ready' : 'done'} label={saleStatusLabel[r.status]} />
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}><MoneyText value={r.total} variant="strong" /></Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      {r.status === 'Completed' && <CancelSaleButton sale={r.id} total={r.total} />}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </QueryView>
    </Panel>
  )
}
