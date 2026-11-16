import { SimpleGrid } from '@mantine/core'
import type { EditorLine } from '@/widgets/line-editor'
import { StatTile } from '@/shared/ui'

export function summarize(lines: EditorLine[]) {
  const counted = lines.filter((line) => line.value !== null)
  const differing = counted.filter((line) => line.value !== (line.reference ?? 0))
  return {
    total: lines.length,
    counted: counted.length,
    uncounted: lines.length - counted.length,
    differing: differing.length,
    delta: differing.reduce((sum, line) => sum + (line.value ?? 0) - (line.reference ?? 0), 0),
  }
}

export function CountSummary({ summary }: { summary: ReturnType<typeof summarize> }) {
  const delta = summary.delta > 0 ? `+${summary.delta}` : summary.delta < 0 ? `−${-summary.delta}` : '0'
  return (
    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
      <StatTile label="Позицій" value={summary.total} />
      <StatTile label="Пораховано" value={summary.counted} hint={summary.uncounted > 0 ? `ще ${summary.uncounted}` : 'усі'} />
      <StatTile label="З різницею" value={summary.differing} />
      <StatTile label="Різниця, од." value={delta} />
    </SimpleGrid>
  )
}
