import { Alert, Group, SegmentedControl, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { countStatus, type CountCard } from '@/entities/inventory-count'
import { useLocationNames } from '@/entities/reference'
import { useCan } from '@/entities/viewer'
import { CountStepButton, useRecordCount } from '@/features/ops-inventory-count'
import { formatDateTime, Perm, shortId } from '@/shared/lib'
import { EmptyState, PageHeader, Panel, StatusBadge, errorMessage } from '@/shared/ui'
import { LineEditor, type EditorLine } from '@/widgets/line-editor'
import { CountSummary, summarize } from './CountSummary'

type Show = 'all' | 'differing' | 'uncounted'

const shown: Record<Show, (line: EditorLine) => boolean> = {
  all: () => true,
  differing: (line) => line.value !== null && line.value !== (line.reference ?? 0),
  uncounted: (line) => line.value === null,
}

const sheetLines = (count: CountCard): EditorLine[] =>
  count.lines.map((line) => ({ book: line.book, reference: line.expected, value: line.counted }))

export function CountSheet({ count }: { count: CountCard }) {
  const can = useCan()
  const locationName = useLocationNames()
  const record = useRecordCount(count.id)
  const [show, setShow] = useState<Show>('all')
  const editable = count.status === 'Open' && can(Perm.InventoryCountManage)
  const lines = sheetLines(count)
  const countedOf = (book: string) => count.lines.find((line) => line.book === book)?.counted ?? 0
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
            onPick={(book) => save(book.id, countedOf(book.id) + 1)}
            onCommit={save}
            empty={<EmptyState title="Таких рядків немає" />}
          />
        </Stack>
      </Panel>
    </Stack>
  )
}
