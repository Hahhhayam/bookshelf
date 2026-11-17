import type { ManagementReport } from '@/entities/report'
import type { AbcClass } from '../ui/AbcTable'

/** How many rows of each long list the dashboard shows; the CSV has them all. */
export const listLimit = 10
const abcSamplePerClass = 5

export function abcSample(report: ManagementReport) {
  const counts: Record<AbcClass, number> = { A: 0, B: 0, C: 0 }
  for (const row of report.abc) counts[row.class] += 1
  const sample = (['A', 'B', 'C'] as const).flatMap((cls) => report.abc.filter((row) => row.class === cls).slice(0, abcSamplePerClass))
  return { counts, sample }
}

/** Book ids whose titles the dashboard shows, so only those are fetched. */
export function shownBookIds(report: ManagementReport): string[] {
  return [
    ...report.topBooks.map((row) => row.book),
    ...abcSample(report).sample.map((row) => row.book),
    ...report.shortages.slice(0, listLimit).map((row) => row.book),
    ...report.slowMovingBooks.slice(0, listLimit),
  ]
}
