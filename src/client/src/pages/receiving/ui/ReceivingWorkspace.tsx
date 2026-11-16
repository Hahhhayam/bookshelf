import { Alert, Button, Group, Stack, Text } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useState } from 'react'
import { BookLookup } from '@/entities/book'
import {
  ConfirmReceiptDialog, difference, ReceivingLineEditor, ReceivingSummaryPanel, remaining, summarize, useReceiveDelivery,
  useReceivingLines, type ReceivingLine,
} from '@/features/purchasing-receive-delivery'
import { tokens } from '@/shared/config/tokens'

/** Scan field, line editor and summary for one delivery (Receiving artboard). Mount with a `key` per delivery. */
export function ReceivingWorkspace({ initialLines, planned, location, order, supplier, onDone }: {
  initialLines: ReceivingLine[]
  planned: boolean
  location: string
  order: string | null
  supplier: string | null
  onDone: (receiptId: string) => void
}) {
  const editor = useReceivingLines(initialLines)
  const receive = useReceiveDelivery()
  const [confirming, setConfirming] = useState(false)
  const summary = summarize(editor.lines, planned)
  const activeLine = editor.lines.find((line) => line.book === editor.active)
  const blocked = summary.received.units === 0 || (!planned && !supplier)

  function confirm() {
    receive.mutate({ location, order, supplier, lines: editor.lines }, { onSuccess: ({ id }) => onDone(id) })
  }

  return (
    <Group align="flex-start" gap={24} wrap="wrap">
      <Stack gap={16} style={{ flex: '999 1 640px', minWidth: 0 }}>
        <BookLookup autoFocus onPick={editor.scan} placeholder="Скануйте книгу — кількість зросте на 1" />
        {planned && activeLine && <SurplusNote line={activeLine} />}
        <div style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}>
          <ReceivingLineEditor lines={editor.lines} planned={planned} active={editor.active}
            onChange={editor.setNow} onRemove={editor.remove} />
        </div>
      </Stack>
      <Stack gap={16} style={{ flex: '1 1 300px', maxWidth: 380 }}>
        <ReceivingSummaryPanel summary={summary} planned={planned} />
        <Button size="lg" disabled={blocked || receive.isSuccess} onClick={() => setConfirming(true)}>Завершити приймання</Button>
        {!planned && !supplier && (
          <Text fz={13} c={tokens.color.ink2} lh="19px">Оберіть постачальника незапланованої поставки.</Text>
        )}
      </Stack>
      <ConfirmReceiptDialog
        opened={confirming}
        lines={editor.lines}
        planned={planned}
        summary={summary}
        loading={receive.isPending}
        error={receive.error}
        onConfirm={confirm}
        onClose={() => { setConfirming(false); receive.reset() }}
      />
    </Group>
  )
}

function SurplusNote({ line }: { line: ReceivingLine }) {
  const diff = difference(line) ?? 0
  if (diff <= 0) return null
  const text = line.ordered === 0
    ? `${line.title ?? 'Книги'} немає в замовленні: прийнято ${line.now}. Її буде зафіксовано як надлишок.`
    : `${line.title ? `«${line.title}»` : 'Позиція'}: прийнято ${line.now} при очікуваних ${remaining(line)}. Надлишок буде зафіксовано як розбіжність.`
  return (
    <Alert role="status" color="yellow" variant="light" icon={<IconAlertTriangle size={18} />} p="xs">{text}</Alert>
  )
}
