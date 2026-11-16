import { Text } from '@mantine/core'
import { formatNumber } from '@/shared/lib'
import { Panel, SimpleTable } from '@/shared/ui'

/** Books that do not sell (surplus); the API returns only their ids. */
export function SlowMovingTable({ rows, more }: { rows: { book: string; title: string }[]; more: number }) {
  return (
    <Panel title="Не продаються" extra={<Text size="sm" c="dimmed">надлишок за період</Text>}>
      <SimpleTable
        empty="Таких книжок немає"
        columns={[{ label: 'Книга' }]}
        rows={rows.map((row) => ({ key: row.book, cells: [row.title] }))}
      />
      {more > 0 && <Text size="sm" c="dimmed" px="md" py="sm">і ще {formatNumber(more)} — повний список в експорті CSV</Text>}
    </Panel>
  )
}
