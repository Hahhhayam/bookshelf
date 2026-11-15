import { Table, Text } from '@mantine/core'
import { useBookTitles } from '@/entities/book'
import { referenceName, type Promotion } from '@/entities/reference'
import type { StatusTone } from '@/shared/config/tokens'
import { formatDateTime } from '@/shared/lib'
import { StatusBadge } from '@/shared/ui'

type Phase = 'scheduled' | 'running' | 'ended'

const phaseView: Record<Phase, { label: string; tone: StatusTone }> = {
  scheduled: { label: 'Заплановано', tone: 'draft' },
  running: { label: 'Діє', tone: 'ready' },
  ended: { label: 'Завершено', tone: 'done' },
}

function phaseOf(promotion: Promotion, now = Date.now()): Phase {
  if (new Date(promotion.from).getTime() > now) return 'scheduled'
  return new Date(promotion.to).getTime() < now ? 'ended' : 'running'
}

export function PromotionTable({ rows }: { rows: Promotion[] }) {
  const title = useBookTitles(rows.flatMap((row) => (row.book ? [row.book] : [])))
  const condition = (row: Promotion) => {
    const target = row.book ? `Книга «${title(row.book)}»` : row.category ? `Категорія «${referenceName('categories', row.category)}»` : 'Усі книги'
    return row.minimumQuantity > 1 ? `${target}, від ${row.minimumQuantity} шт.` : target
  }

  return (
    <Table.ScrollContainer minWidth={720}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Назва</Table.Th><Table.Th>Період</Table.Th><Table.Th>Умова</Table.Th>
            <Table.Th ta="right">Знижка</Table.Th><Table.Th ta="right">Пріоритет</Table.Th><Table.Th>Стан</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {[...rows].sort((a, b) => b.from.localeCompare(a.from)).map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td><Text fw={600}>{row.name}</Text></Table.Td>
              <Table.Td><Text size="sm">{formatDateTime(row.from)} — {formatDateTime(row.to)}</Text></Table.Td>
              <Table.Td><Text size="sm">{condition(row)}</Text></Table.Td>
              <Table.Td ta="right">{row.discountPercent}%</Table.Td>
              <Table.Td ta="right">{row.priority}</Table.Td>
              <Table.Td><StatusBadge {...phaseView[phaseOf(row)]} /></Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
