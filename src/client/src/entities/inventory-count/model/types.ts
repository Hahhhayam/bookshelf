import type { StatusTone } from '@/shared/config/tokens'

export type CountStatus = 'Open' | 'Counted' | 'Approved'

/** A count started in this browser; the API cannot read counts back yet (GAP-08). */
export interface CountSession {
  id: string
  location: string
  startedAt: string
  status: CountStatus
  counted: Record<string, number>
}

export const countStatus: Record<CountStatus, { label: string; tone: StatusTone }> = {
  Open: { label: 'Триває', tone: 'progress' },
  Counted: { label: 'Пораховано', tone: 'ready' },
  Approved: { label: 'Затверджено', tone: 'done' },
}
