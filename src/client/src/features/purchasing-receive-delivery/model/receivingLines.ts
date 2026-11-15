export interface ReceivingLine {
  book: string
  /** Known when the line came from a scan; order lines get their titles from the catalog. */
  title?: string
  ordered: number
  alreadyReceived: number
  /** What arrived in this delivery; null until the line is scanned or typed. */
  now: number | null
}

export type LineKind = 'none' | 'zero' | 'neg' | 'pos'

export function remaining(line: ReceivingLine): number {
  return Math.max(0, line.ordered - line.alreadyReceived)
}

/** Difference against what was still awaited; null while the line is not counted yet. */
export function difference(line: ReceivingLine): number | null {
  return line.now === null ? null : line.now - remaining(line)
}

/** Without an order nothing is expected, so an unplanned delivery has no differences to show. */
export function lineKind(line: ReceivingLine, planned: boolean): LineKind {
  if (!planned) return 'zero'
  const diff = difference(line)
  if (diff === null) return remaining(line) > 0 ? 'none' : 'zero'
  return diff < 0 ? 'neg' : diff > 0 ? 'pos' : 'zero'
}

export interface Tally {
  units: number
  titles: number
}

export interface ReceivingSummary {
  expected: Tally
  received: Tally
  shortage: Tally
  surplus: Tally
  notCounted: Tally
  /** Share of awaited units already counted, 0–100. */
  progress: number
}

function tally(lines: readonly ReceivingLine[], units: (line: ReceivingLine) => number): Tally {
  const counted = lines.map(units).filter((n) => n > 0)
  return { units: counted.reduce((sum, n) => sum + n, 0), titles: counted.length }
}

export function summarize(lines: readonly ReceivingLine[], planned: boolean): ReceivingSummary {
  const expected = tally(lines, remaining)
  const notCounted = planned ? tally(lines, (l) => (l.now === null ? remaining(l) : 0)) : { units: 0, titles: 0 }
  return {
    expected,
    received: tally(lines, (l) => l.now ?? 0),
    shortage: planned ? tally(lines, (l) => (l.now === null ? 0 : Math.max(0, -(difference(l) ?? 0)))) : { units: 0, titles: 0 },
    surplus: planned ? tally(lines, (l) => Math.max(0, difference(l) ?? 0)) : { units: 0, titles: 0 },
    notCounted,
    progress: expected.units === 0 ? 100 : Math.round(((expected.units - notCounted.units) / expected.units) * 100),
  }
}

/** What goes to the server: only books that actually arrived. */
export function receivedItems(lines: readonly ReceivingLine[]): { book: string; quantity: number }[] {
  return lines.filter((l) => (l.now ?? 0) > 0).map((l) => ({ book: l.book, quantity: l.now! }))
}
