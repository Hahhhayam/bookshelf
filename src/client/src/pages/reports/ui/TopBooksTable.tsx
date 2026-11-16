import type { Money } from '@/shared/api'
import { formatNumber } from '@/shared/lib'
import { MoneyText, Panel, SimpleTable } from '@/shared/ui'

export interface TopBookRow {
  book: string
  title: string
  sold: number
  revenue: Money
}

export function TopBooksTable({ rows }: { rows: TopBookRow[] }) {
  return (
    <Panel title="Топ книжок">
      <SimpleTable
        empty="Немає даних за цей період"
        columns={[{ label: '№' }, { label: 'Книга' }, { label: 'Продано', numeric: true }, { label: 'Виручка', numeric: true }]}
        rows={rows.map((row, i) => ({
          key: row.book,
          cells: [i + 1, <strong key="t">{row.title}</strong>, formatNumber(row.sold), <MoneyText key="m" value={row.revenue} />],
        }))}
      />
    </Panel>
  )
}
