import { Alert, Button, Group, Stack, Text } from '@mantine/core'
import { IconBooks } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { LocationSelect } from '@/entities/reference'
import { useLocationStock } from '@/entities/stock'
import { useViewer, useWorkingLocation } from '@/entities/viewer'
import { useCreateTransfer } from '@/features/ops-transfer-steps'
import { EmptyState, PageHeader, Panel, errorMessage } from '@/shared/ui'
import { LineEditor, type EditorLine } from '@/widgets/line-editor'
import { useTransferDraft } from './model/useTransferDraft'

export default function TransferNewPage() {
  const from = useWorkingLocation()
  const own = useViewer().data?.locations
  const navigate = useNavigate()
  const [to, setTo] = useState<string | null>(null)
  const draft = useTransferDraft()
  const stock = useLocationStock(from?.id)
  const create = useCreateTransfer()

  const available = (book: string) => stock.data?.find((line) => line.book === book)?.available ?? 0
  const lines: EditorLine[] = draft.lines.map((line) => ({ book: line.book, reference: available(line.book), value: line.quantity }))
  const tooMany = (line: EditorLine) => (line.value ?? 0) > (line.reference ?? 0) ? `Більше, ніж доступно (${line.reference ?? 0})` : null
  const ready = !!from && !!to && lines.length > 0 && lines.every((line) => (line.value ?? 0) > 0 && !tooMany(line))

  function submit() {
    if (!ready) return
    const items = draft.lines.map((line) => ({ book: line.book, quantity: line.quantity ?? 0 }))
    create.mutate({ from: from!.id, to: to!, items }, { onSuccess: ({ id }) => navigate(`/staff/transfers/${id}`) })
  }

  return (
    <Stack gap="lg">
      <PageHeader eyebrow={`Відправник: ${from?.name ?? '—'}`} title="Нове переміщення" />
      <Panel padding={20}>
        <div style={{ maxWidth: 420 }}>
          <LocationSelect own={own} label="Куди" value={to} onChange={setTo} exclude={from?.id} />
        </div>
      </Panel>
      <Panel title="Позиції" padding={16}>
        <LineEditor
          lines={lines}
          referenceLabel="Доступно у відправника"
          valueLabel="Кількість"
          onPick={(book) => draft.add(book.id)}
          onCommit={draft.set}
          onRemove={draft.remove}
          warning={tooMany}
          empty={<EmptyState icon={<IconBooks size={40} stroke={1.5} />} title="Ще немає позицій" text="Скануйте книгу або знайдіть її за назвою — кожен скан додає 1 примірник." />}
        />
      </Panel>
      {create.isError && <Alert color="red" variant="light">{errorMessage(create.error)}</Alert>}
      <Group justify="space-between" wrap="wrap">
        <Text size="sm" c="dimmed">
          {lines.length} позицій · {lines.reduce((sum, line) => sum + (line.value ?? 0), 0)} од.
        </Text>
        <Group gap="sm">
          <Button variant="default" onClick={() => navigate('/staff/transfers')}>Скасувати</Button>
          <Button disabled={!ready} loading={create.isPending} onClick={submit}>Створити переміщення</Button>
        </Group>
      </Group>
    </Stack>
  )
}
