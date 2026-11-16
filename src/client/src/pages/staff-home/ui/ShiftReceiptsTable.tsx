import { Table, Text } from '@mantine/core'
import { IconReceipt } from '@tabler/icons-react'
import { paymentLabel, useShiftReceipts } from '@/entities/sale'
import { uah } from '@/shared/api'
import { tokens } from '@/shared/config/tokens'
import { shortId } from '@/shared/lib'
import { EmptyState, MoneyText, Panel, QueryView } from '@/shared/ui'

const time = new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' })

function receiptsWord(n: number) {
  const last = n % 10
  const teen = n % 100 >= 11 && n % 100 <= 14
  return last === 1 && !teen ? 'чек' : last >= 2 && last <= 4 && !teen ? 'чеки' : 'чеків'
}

/** «Мої чеки за зміну»: receipts completed in this tab (the API has no sale list yet, GAP-07). */
export function ShiftReceiptsTable() {
  const query = useShiftReceipts()
  const receipts = query.data ?? []
  const sum = receipts.reduce((s, r) => s + Math.round(r.total.amount * 100), 0) / 100
  return (
    <Panel title="Мої чеки за зміну"
      extra={receipts.length > 0 && <Text fz={14} c={tokens.color.ink2}>{receipts.length} {receiptsWord(receipts.length)} · <MoneyText value={uah(sum)} /></Text>}>
      <QueryView query={query} skeletonRows={4} isEmpty={(items) => items.length === 0}
        empty={<EmptyState icon={<IconReceipt size={36} stroke={1.75} />} title="Чеків ще немає"
          text="Проведені на касі чеки цієї зміни з’являться тут." />}>
        {(items) => (
          <Table.ScrollContainer minWidth={640}>
            <Table verticalSpacing={11}>
              <Table.Thead>
                <Table.Tr><Table.Th>Чек</Table.Th><Table.Th>Час</Table.Th><Table.Th>Книжок</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Сума</Table.Th><Table.Th>Оплата</Table.Th></Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((r) => (
                  <Table.Tr key={r.id}>
                    <Table.Td ff="monospace" fz={13}>{shortId(r.id)}</Table.Td>
                    <Table.Td>{time.format(new Date(r.at))}</Table.Td>
                    <Table.Td>{r.items}</Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}><MoneyText value={r.total} variant="strong" /></Table.Td>
                    <Table.Td>{r.methods.map((m) => paymentLabel[m]).join(', ')}</Table.Td>                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </QueryView>
    </Panel>
  )
}
