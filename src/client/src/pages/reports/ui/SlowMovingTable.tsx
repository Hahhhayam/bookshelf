import { Text } from '@mantine/core'
import { formatNumber } from '@/shared/lib'
import { Panel, SimpleTable } from '@/shared/ui'
import { DrillLink } from './DrillLink'

/** Books that do not sell (surplus); the API returns only their ids. */
export function SlowMovingTable({ rows, more, onBook }: {
  rows: { book: string; title: string }[]
  more: number
  onBook: (book: string) => void
}) {
  return (
    <Panel title="Не продаються" extra={<Text size="sm" c="dimmed">надлишок за період</Text>}>
      <SimpleTable
        empty="Таких книжок немає"
        columns={[{ label: 'Книга' }]}
        rows={rows.map((row) => ({ key: row.book, cells: [<DrillLink key="t" onClick={() => onBook(row.book)}>{row.title}</DrillLink>] }))}
      />
      {more > 0 && <Text size="sm" c="dimmed" px="md" py="sm">і ще {formatNumber(more)} — повний список в експорті CSV</Text>}
    </Panel>
  )
}
