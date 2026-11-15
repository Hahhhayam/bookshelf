import { Text } from '@mantine/core'
import { formatNumber } from '@/shared/lib'
import { Panel } from '@/shared/ui'
import { SimpleTable } from './SimpleTable'

/** Books that do not sell (surplus); the API returns only their ids (API_GAPS.md, GAP-49). */
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
