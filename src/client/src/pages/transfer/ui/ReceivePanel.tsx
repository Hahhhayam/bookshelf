import { Button, Group, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { transferStep, type TransferCard } from '@/entities/transfer'
import { useReceiveTransfer } from '@/features/ops-transfer-steps'
import { ConfirmDialog, Panel, errorMessage } from '@/shared/ui'
import { LineEditor, type EditorLine } from '@/widgets/line-editor'

/** The receiver's form: pre-filled with the shipped quantities, so only the differences are typed. */
export function ReceivePanel({ transfer }: { transfer: TransferCard }) {
  const [received, setReceived] = useState<Record<string, number | null>>(
    () => Object.fromEntries(transfer.lines.map((line) => [line.book, line.shipped])),
  )
  const [confirming, setConfirming] = useState(false)
  const receive = useReceiveTransfer(transfer.id)
  const step = transferStep.Shipped!

  const lines: EditorLine[] = transfer.lines.map((line) => ({ book: line.book, reference: line.shipped, value: received[line.book] ?? null }))
  const complete = lines.every((line) => line.value !== null)
  const differing = lines.filter((line) => line.value !== line.reference).length
  const shipped = lines.reduce((sum, line) => sum + (line.reference ?? 0), 0)
  const actual = lines.reduce((sum, line) => sum + (line.value ?? 0), 0)

  function confirm() {
    const items = lines.map((line) => ({ book: line.book, quantity: line.value ?? 0 }))
    receive.mutate(items, {
      onSuccess: () => { notifications.show({ color: 'green', message: 'Переміщення прийнято' }); setConfirming(false) },
    })
  }

  return (
    <Panel title="Приймання" padding={16}>
      <LineEditor
        lines={lines}
        referenceLabel="Відправлено"
        valueLabel="Фактично"
        showDifference
        onCommit={(book, value) => setReceived((current) => ({ ...current, [book]: value }))}
      />
      <Group justify="space-between" mt="md" wrap="wrap">
        <Text size="md">Прийнято {actual} з {shipped} од. · рядків із різницею: {differing}</Text>
        <Button disabled={!complete} onClick={() => setConfirming(true)}>Прийняти переміщення</Button>
      </Group>
      <ConfirmDialog
        opened={confirming}
        title={step.confirmTitle}
        confirmLabel={step.label}
        loading={receive.isPending}
        onConfirm={confirm}
        onClose={() => { receive.reset(); setConfirming(false) }}
      >
        <Text size="md">
          {step.confirmText} Прийнято {actual} з {shipped} од.
          {differing > 0 && <strong> Рядків із розбіжністю: {differing} — по них буде створено розбіжності.</strong>}
        </Text>
        {receive.isError && <Text size="sm" c="red" mt="sm">{errorMessage(receive.error)}</Text>}
      </ConfirmDialog>
    </Panel>
  )
}
