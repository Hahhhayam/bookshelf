import type { Money } from '@/shared/api'
import { formatNumber } from '@/shared/lib'
import { MoneyText, Panel, SimpleTable } from '@/shared/ui'
import { DrillLink } from './DrillLink'

export interface TopBookRow {
  book: string
  title: string
  sold: number
  revenue: Money
}

export function TopBooksTable({ rows, onBook }: { rows: TopBookRow[]; onBook: (book: string) => void }) {
  return (
    <Panel title="Топ книжок">
      <SimpleTable
        empty="Немає даних за цей період"
        columns={[{ label: '№' }, { label: 'Книга' }, { label: 'Продано', numeric: true }, { label: 'Виручка', numeric: true }]}
        rows={rows.map((row, i) => ({
          key: row.book,
          cells: [i + 1, <DrillLink key="t" onClick={() => onBook(row.book)}><strong>{row.title}</strong></DrillLink>, formatNumber(row.sold), <MoneyText key="m" value={row.revenue} />],
        }))}
      />
    </Panel>
  )
}
