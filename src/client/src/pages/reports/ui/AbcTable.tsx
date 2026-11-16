import { Text } from '@mantine/core'
import { tokens } from '@/shared/config/tokens'
import { formatNumber } from '@/shared/lib'
import { Panel, SimpleTable } from '@/shared/ui'

export type AbcClass = 'A' | 'B' | 'C'

export interface AbcRow {
  book: string
  title: string
  cls: AbcClass
  share: number
  cumulative: number
}

const chip: Record<AbcClass, { background: string; color: string }> = {
  A: { background: tokens.color.accent, color: tokens.color.surface },
  B: { background: tokens.color.accentSoft, color: tokens.color.accent },
  C: { background: tokens.color.sunk, color: tokens.color.ink2 },
}

const percent = new Intl.NumberFormat('uk-UA', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 2 })

function AbcChip({ cls }: { cls: AbcClass }) {
  return (
    <span
      aria-label={`Клас ${cls}`}
      style={{ ...chip[cls], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 22, fontSize: 12, fontWeight: 700 }}
    >
      {cls}
    </span>
  )
}

/** ABC analysis by revenue: a sample of each class and how many titles fall into each. */
export function AbcTable({ rows, counts }: { rows: AbcRow[]; counts: Record<AbcClass, number> }) {
  const total = counts.A + counts.B + counts.C
  return (
    <Panel title="ABC-аналіз за виручкою" extra={<Text size="sm" c="dimmed">A — 80%, B — 15%, C — 5% виручки</Text>}>
      <SimpleTable
        empty="Немає даних за цей період"
        columns={[{ label: 'Клас' }, { label: 'Книга' }, { label: 'Частка', numeric: true }, { label: 'Накопичено', numeric: true }]}
        rows={rows.map((row) => ({
          key: row.book,
          cells: [<AbcChip key="c" cls={row.cls} />, row.title, percent.format(row.share), percent.format(row.cumulative)],
        }))}
      />
      {total > 0 && (
        <Text size="sm" c="dimmed" px="md" py="sm" style={{ borderTop: `1px solid ${tokens.color.line}` }}>
          Усього {formatNumber(total)} назв · A: {formatNumber(counts.A)} · B: {formatNumber(counts.B)} · C: {formatNumber(counts.C)}
        </Text>
      )}
    </Panel>
  )
}
