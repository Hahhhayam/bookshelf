import { Group, Stack, Text } from '@mantine/core'
import { statusTone, tokens } from '@/shared/config/tokens'
import { plural } from '@/shared/lib'
import type { ReceivingSummary, Tally } from '../model/receivingLines'

const tallyText = (t: Tally, sign = '') => `${sign}${t.units} од. · ${t.titles} ${plural(t.titles, ['назва', 'назви', 'назв'])}`

function Row({ label, value, color, strong }: { label: string; value: string; color?: string; strong?: boolean }) {
  return (
    <Group justify="space-between" py={6} fz={14}>
      <Text span fz={14} c={color ?? tokens.color.ink2} fw={strong ? 600 : 400}>{label}</Text>
      <Text span fz={14} fw={700} c={color}>{value}</Text>
    </Group>
  )
}

/** The running totals beside the line editor (Receiving artboard «Підсумок»). */
export function ReceivingSummaryPanel({ summary, planned }: { summary: ReceivingSummary; planned: boolean }) {
  return (
    <Stack gap={4} p={20} style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}>
      <Text fw={600} fz={16} mb={8}>Підсумок</Text>
      {planned && <Row label="Очікується" value={tallyText(summary.expected)} />}
      <Row label="Прийнято" value={`${summary.received.units} од.`} />
      {planned && (
        <div style={{ borderTop: `1px solid ${tokens.color.sunk}`, marginTop: 6, paddingTop: 6 }}>
          <Row label="Недостача" value={tallyText(summary.shortage, summary.shortage.units ? '−' : '')} color={statusTone.problem.text} strong />
          <Row label="Надлишок" value={tallyText(summary.surplus, summary.surplus.units ? '+' : '')} color={statusTone.progress.text} strong />
          <Row label="Ще не скановано" value={tallyText(summary.notCounted)} color={statusTone.attention.text} strong />
        </div>
      )}
    </Stack>
  )
}
