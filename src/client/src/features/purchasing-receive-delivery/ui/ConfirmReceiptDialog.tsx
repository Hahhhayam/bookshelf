import { Alert, List, Stack, Text } from '@mantine/core'
import { useBookTitles } from '@/entities/book'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { difference, remaining, type ReceivingLine, type ReceivingSummary } from '../model/receivingLines'

/** Lines whose count differs from what was awaited, in words: what will go into the discrepancy record. */
function describeDifferences(lines: readonly ReceivingLine[], title: (line: ReceivingLine) => string): string[] {
  return lines.flatMap((line) => {
    if (line.now === null) return remaining(line) > 0 ? [`«${title(line)}» не скановано — недостача ${remaining(line)} од.`] : []
    const diff = difference(line) ?? 0
    if (diff < 0) return [`«${title(line)}»: прийнято ${line.now} з ${remaining(line)} — недостача ${-diff} од.`]
    if (diff > 0) return [`«${title(line)}»: прийнято ${line.now} при очікуваних ${remaining(line)} — надлишок ${diff} од.`]
    return []
  })
}

export function ConfirmReceiptDialog({ opened, lines, planned, summary, loading, error, onConfirm, onClose }: {
  opened: boolean
  lines: readonly ReceivingLine[]
  planned: boolean
  summary: ReceivingSummary
  loading: boolean
  error: unknown
  onConfirm: () => void
  onClose: () => void
}) {
  const catalogTitle = useBookTitles(lines.map((l) => l.book))
  const title = (line: ReceivingLine) => line.title ?? catalogTitle(line.book)
  const differences = planned ? describeDifferences(lines, title) : []
  return (
    <ConfirmDialog
      opened={opened}
      title="Завершити приймання?"
      confirmLabel={`Прийняти ${summary.received.units} од.`}
      loading={loading}
      onConfirm={onConfirm}
      onClose={onClose}
    >
      <Stack gap="sm">
        <Text size="sm">Залишки складу зростуть одразу після підтвердження. Скасувати приймання потім не вийде.</Text>
        {differences.length > 0 && (
          <Alert color="yellow" variant="light" title={`Розбіжності: ${differences.length}`}>
            <List size="sm" spacing={4}>{differences.map((text) => <List.Item key={text}>{text}</List.Item>)}</List>
            <Text size="sm" mt="xs">Акт розбіжностей піде менеджеру з закупівель.</Text>
          </Alert>
        )}
        {error !== null && error !== undefined && <Alert color="red" variant="light">{errorMessage(error)}</Alert>}
      </Stack>
    </ConfirmDialog>
  )
}
