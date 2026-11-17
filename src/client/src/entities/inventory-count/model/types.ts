import type { StatusTone } from '@/shared/config/tokens'

export type CountStatus = 'Open' | 'Counted' | 'Approved' | 'Posted'

export interface CountSummary {
  id: string
  location: string
  status: CountStatus
  startedAt: string
  lines: number
  counted: number
}

/** A count sheet: expected quantities are fixed when the count starts. */
export interface CountCard {
  id: string
  location: string
  status: CountStatus
  startedAt: string
  lines: { book: string; expected: number; counted: number | null }[]
}

export const countStatus: Record<CountStatus, { label: string; tone: StatusTone }> = {
  Open: { label: 'Триває', tone: 'progress' },
  Counted: { label: 'Пораховано', tone: 'ready' },
  Approved: { label: 'Затверджено', tone: 'done' },
  Posted: { label: 'Проведено', tone: 'done' },
}
