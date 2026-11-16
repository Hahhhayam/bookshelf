import { Alert, Group, SegmentedControl, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { countStatus, type CountSession } from '@/entities/inventory-count'
import { locationNames } from '@/entities/reference'
import { useLocationStock } from '@/entities/stock'
import { useCan, useViewer } from '@/entities/viewer'
import { CountStepButton, useRecordCount } from '@/features/ops-inventory-count'
import { formatDateTime, Perm, shortId } from '@/shared/lib'
import { EmptyState, PageHeader, Panel, QueryView, StatusBadge, errorMessage } from '@/shared/ui'
import { LineEditor, type EditorLine } from '@/widgets/line-editor'
import { CountSummary, summarize } from './CountSummary'

type Show = 'all' | 'differing' | 'uncounted'

const shown: Record<Show, (line: EditorLine) => boolean> = {
  all: () => true,
  differing: (line) => line.value !== null && line.value !== (line.reference ?? 0),
  uncounted: (line) => line.value === null,
}

/**
 * Expected quantities are the location's current on-hand stock: the API does not return the count's own lines
 * (GAP-08). Books found on the shelf but absent from stock are added with expected 0.
 */
function sheetLines(stock: { book: string; onHand: number }[], counted: Record<string, number>): EditorLine[] {
  const expected = new Map(stock.map((line) => [line.book, line.onHand]))
  const extra = Object.keys(counted).filter((book) => !expected.has(book)).map((book) => ({ book, reference: 0, value: counted[book]! }))
  return [...extra, ...stock.map((line) => ({ book: line.book, reference: line.onHand, value: counted[line.book] ?? null }))]
}

export function CountSheet({ count }: { count: CountSession }) {
  const can = useCan()
  const locationName = locationNames(useViewer().data?.locations)
  const stock = useLocationStock(count.location)
  const record = useRecordCount(count.id)
  const [show, setShow] = useState<Show>('all')
  const editable = count.status === 'Open' && can(Perm.InventoryCountManage)
  const lines = sheetLines(stock.data ?? [], count.counted)
  const summary = summarize(lines)

  function save(book: string, counted: number | null) {
    if (counted === null) return
    record.mutate({ book, counted }, {
      onError: (error) => notifications.show({ color: 'red', title: 'Кількість не записано', message: errorMessage(error) }),
    })
  }

  return (
    <Stack gap="lg">
      <PageHeader
        eyebrow={`${locationName(count.location)} · розпочато ${formatDateTime(count.startedAt)}`}
        title={`Інвентаризація ${shortId(count.id)}`}
        after={<StatusBadge {...countStatus[count.status]} />}
        actions={<CountStepButton id={count.id} status={count.status} uncounted={summary.uncounted} differences={summary.differing} />}
      />
      <CountSummary summary={summary} />
      {record.isError && <Alert color="red" variant="light">{errorMessage(record.error)}</Alert>}
      <Panel padding={16}>
        <QueryView query={stock}>
          {() => (
            <Stack gap="sm">
              <Group justify="flex-end">
                <SegmentedControl
                  value={show} onChange={(value) => setShow(value as Show)}
                  data={[{ value: 'all', label: 'Усі' }, { value: 'differing', label: 'З різницею' }, { value: 'uncounted', label: 'Непораховані' }]}
                />
              </Group>
              <LineEditor
                lines={lines.filter(shown[show])}
                referenceLabel="Очікується"
                valueLabel="Пораховано"
                showDifference
                readOnly={!editable}
                scanPlaceholder="Скануйте книгу — кількість зросте на 1"
                onPick={(book) => save(book.id, (count.counted[book.id] ?? 0) + 1)}
                onCommit={save}
                empty={<EmptyState title={show === 'all' ? 'На локації немає залишків' : 'Таких рядків немає'} text={show === 'all' ? 'Скануйте книжки, знайдені на полицях.' : undefined} />}
              />
            </Stack>
          )}
        </QueryView>
      </Panel>
    </Stack>
  )
}
