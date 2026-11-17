import { Table, Text } from '@mantine/core'
import type { CustomerCard } from '@/entities/customer'
import { useReferenceNames } from '@/entities/reference'
import { tokens, type StatusTone } from '@/shared/config/tokens'
import { formatDate, formatMoney, shortId } from '@/shared/lib'
import { MoneyText, Panel, StatusBadge } from '@/shared/ui'

type Purchase = CustomerCard['purchases'][number]

const purchaseStatus: Record<Purchase['status'], { label: string; tone: StatusTone }> = {
  Completed: { label: 'Оплачено', tone: 'done' },
  Cancelled: { label: 'Скасовано', tone: 'problem' },
}

function summary(purchases: Purchase[]) {
  const paid = purchases.filter((p) => p.status === 'Completed')
  if (paid.length === 0) return 'покупок ще не було'
  const total = paid.reduce((sum, p) => sum + p.total.amount, 0)
  const currency = paid[0]!.total.currency
  return `${paid.length} покупок · ${formatMoney({ amount: total, currency })} · середній чек ${formatMoney({ amount: total / paid.length, currency })}`
}

export function PurchasesPanel({ purchases }: { purchases: Purchase[] }) {
  const locationName = useReferenceNames('locations')
  const sorted = [...purchases].sort((a, b) => b.at.localeCompare(a.at))
  return (
    <Panel title="Історія покупок" extra={<Text size="sm" c="dimmed">{summary(purchases)}</Text>}>
      {sorted.length === 0 ? <Text c="dimmed" size="sm" p="md">Покупок ще не було.</Text> : (
        <Table.ScrollContainer minWidth={560}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr><Table.Th>Дата</Table.Th><Table.Th>Де</Table.Th><Table.Th>Документ</Table.Th><Table.Th ta="right">Сума</Table.Th><Table.Th>Стан</Table.Th></Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sorted.map((p) => (
                <Table.Tr key={p.sale}>
                  <Table.Td>{formatDate(p.at)}</Table.Td>
                  <Table.Td>{locationName(p.location)}</Table.Td>
                  <Table.Td style={{ fontFamily: tokens.font.mono }}>Чек {shortId(p.sale)}</Table.Td>
                  <Table.Td ta="right"><MoneyText value={p.total} variant={p.status === 'Cancelled' ? 'strike' : 'default'} /></Table.Td>
                  <Table.Td><StatusBadge {...purchaseStatus[p.status]} /></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Panel>
  )
}
