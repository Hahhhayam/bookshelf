import { ActionIcon, NumberInput, Table, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import type { CSSProperties } from 'react'
import { useBookTitles } from '@/entities/book'
import { statusTone, tokens } from '@/shared/config/tokens'
import { difference, lineKind, type LineKind, type ReceivingLine } from '../model/receivingLines'

const tint = (bg: string) => `color-mix(in srgb, ${bg} 40%, ${tokens.color.surface})`

const rowStyle: Record<LineKind, CSSProperties> = {
  neg: { background: tint(statusTone.problem.bg) },
  pos: { background: tint(statusTone.progress.bg) },
  none: {},
  zero: {},
}

const diffStyle: Record<LineKind, CSSProperties> = {
  neg: { color: statusTone.problem.text, fontWeight: 700 },
  pos: { color: statusTone.progress.text, fontWeight: 700 },
  none: { color: statusTone.attention.text, fontWeight: 600 },
  zero: { color: tokens.color.ink3 },
}

function diffText(line: ReceivingLine, kind: LineKind): string {
  if (kind === 'none') return 'не скановано'
  const diff = difference(line) ?? 0
  return diff > 0 ? `+${diff}` : diff < 0 ? `−${Math.abs(diff)}` : '0'
}

/** Ordered, already received and received now per book; differences are coloured before confirmation. */
export function ReceivingLineEditor({ lines, planned, active, onChange, onRemove }: {
  lines: readonly ReceivingLine[]
  planned: boolean
  active: string | null
  onChange: (book: string, now: number | null) => void
  onRemove: (book: string) => void
}) {
  const catalogTitle = useBookTitles(lines.filter((l) => !l.title).map((l) => l.book))
  if (lines.length === 0) {
    return <Text c="dimmed" size="sm" p="md">Скануйте книги з поставки — кожна з’явиться тут.</Text>
  }
  return (
    <Table.ScrollContainer minWidth={planned ? 760 : 480} maxHeight={560}>
      <Table stickyHeader verticalSpacing={10} horizontalSpacing={12}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Книга</Table.Th>
            {planned && <Table.Th ta="right">Замовлено</Table.Th>}
            {planned && <Table.Th ta="right">Вже прийнято</Table.Th>}
            <Table.Th ta="right">Прийнято зараз</Table.Th>
            {planned && <Table.Th ta="right">Різниця</Table.Th>}
            <Table.Th w={40} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lines.map((line) => (
            <LineRow key={line.book} line={line} planned={planned} active={line.book === active}
              title={line.title ?? catalogTitle(line.book)} onChange={onChange} onRemove={onRemove} />
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function LineRow({ line, planned, active, title, onChange, onRemove }: {
  line: ReceivingLine
  planned: boolean
  active: boolean
  title: string
  onChange: (book: string, now: number | null) => void
  onRemove: (book: string) => void
}) {
  const kind = lineKind(line, planned)
  const style = active
    ? { background: tokens.color.accentSoft, boxShadow: `inset 3px 0 0 ${tokens.color.accent}` }
    : rowStyle[kind]
  return (
    <Table.Tr style={style}>
      <Table.Td>
        <Text fw={600} size="sm">{title}</Text>
        {planned && line.ordered === 0 && <Text fz={12} c={statusTone.progress.text}>Немає в замовленні</Text>}
      </Table.Td>
      {planned && <Table.Td ta="right">{line.ordered}</Table.Td>}
      {planned && <Table.Td ta="right">{line.alreadyReceived}</Table.Td>}
      <Table.Td ta="right">
        <NumberInput
          aria-label={`Прийнято, ${title}`}
          value={line.now ?? ''}
          placeholder="—"
          min={0}
          allowDecimal={false}
          allowNegative={false}
          hideControls
          w={80}
          ml="auto"
          styles={{ input: { textAlign: 'right', fontWeight: 600, fontSize: 15 } }}
          onChange={(value) => onChange(line.book, value === '' ? null : Number(value))}
        />
      </Table.Td>
      {planned && <Table.Td ta="right" style={{ whiteSpace: 'nowrap', ...diffStyle[kind] }}>{diffText(line, kind)}</Table.Td>}
      <Table.Td>
        {line.ordered === 0 && (
          <ActionIcon variant="subtle" color="gray" aria-label={`Прибрати ${title}`} onClick={() => onRemove(line.book)}>
            <IconX size={16} />
          </ActionIcon>
        )}
      </Table.Td>
    </Table.Tr>
  )
}
