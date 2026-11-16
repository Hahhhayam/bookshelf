import { ActionIcon, Stack, Table, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { BookLookup, useBookTitles, type BookHit } from '@/entities/book'
import { statusTone } from '@/shared/config/tokens'
import { DifferenceText, differenceRowStyle } from '@/shared/ui'
import type { EditorLine } from '../model/types'
import { QuantityInput } from './QuantityInput'

/**
 * Line entry (Receiving artboard): a scan field above a table of books with a reference quantity, the entered
 * quantity and the difference. Scanning or typing is the page's business: it gets the picked book and committed values.
 */
export function LineEditor({
  lines, valueLabel, referenceLabel, showDifference = false, scanPlaceholder = 'Скануйте книгу або введіть назву',
  onPick, onCommit, onRemove, warning, readOnly = false, empty,
}: {
  lines: EditorLine[]
  valueLabel: string
  referenceLabel?: string
  showDifference?: boolean
  scanPlaceholder?: string
  /** Without it there is no scan field. */
  onPick?: (book: BookHit) => void
  onCommit: (book: string, value: number | null) => void
  onRemove?: (book: string) => void
  warning?: (line: EditorLine) => string | null
  readOnly?: boolean
  empty?: ReactNode
}) {
  const title = useBookTitles(lines.map((line) => line.book))
  const difference = (line: EditorLine) =>
    showDifference && line.value !== null && line.reference != null ? line.value - line.reference : null

  return (
    <Stack gap="sm">
      {onPick && !readOnly && <BookLookup autoFocus placeholder={scanPlaceholder} onPick={onPick} />}
      {lines.length === 0 ? empty : (
        <Table.ScrollContainer minWidth={560}>
          <Table verticalSpacing="xs" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Книга</Table.Th>
                {referenceLabel && <Table.Th ta="right">{referenceLabel}</Table.Th>}
                <Table.Th ta="right">{valueLabel}</Table.Th>
                {showDifference && <Table.Th ta="right">Різниця</Table.Th>}
                {onRemove && !readOnly && <Table.Th w={48} />}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {lines.map((line) => {
                const diff = difference(line)
                const note = warning?.(line) ?? null
                return (
                  <Table.Tr key={line.book} style={differenceRowStyle(diff)}>
                    <Table.Td>
                      <Text fw={600} size="md">{title(line.book)}</Text>
                      {note && <Text size="sm" c={statusTone.problem.text}>{note}</Text>}
                    </Table.Td>
                    {referenceLabel && <Table.Td ta="right">{line.reference ?? '—'}</Table.Td>}
                    <Table.Td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {readOnly ? <Text size="md">{line.value ?? '—'}</Text> : (
                          <QuantityInput
                            value={line.value}
                            label={`${valueLabel}, ${title(line.book)}`}
                            highlighted={note !== null}
                            onCommit={(value) => onCommit(line.book, value)}
                          />
                        )}
                      </div>
                    </Table.Td>
                    {showDifference && <Table.Td ta="right"><DifferenceText value={diff} /></Table.Td>}
                    {onRemove && !readOnly && (
                      <Table.Td>
                        <ActionIcon variant="subtle" color="gray" aria-label="Прибрати рядок" onClick={() => onRemove(line.book)}>
                          <IconTrash size={16} stroke={1.75} />
                        </ActionIcon>
                      </Table.Td>
                    )}
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Stack>
  )
}
