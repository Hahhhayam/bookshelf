import { dayStart, endOfDay, toInputDate, type InputDate } from '@/shared/lib'

export type Preset = 'today' | 'week' | 'month' | 'quarter' | 'custom'

export const presets: { value: Preset; label: string }[] = [
  { value: 'today', label: 'Сьогодні' },
  { value: 'week', label: '7 днів' },
  { value: 'month', label: 'Місяць' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'custom', label: 'Свій' },
]

function presetStart(preset: Exclude<Preset, 'custom'>, today: Date): Date {
  const y = today.getFullYear()
  const m = today.getMonth()
  switch (preset) {
    case 'today': return new Date(y, m, today.getDate())
    case 'week': return new Date(y, m, today.getDate() - 6)
    case 'month': return new Date(y, m, 1)
    case 'quarter': return new Date(y, m - (m % 3), 1)
  }
}

/** The period a preset or a custom range stands for; whole days, so the query key stays stable within a day. */
export function periodOf(preset: Preset, custom: { from: InputDate; to: InputDate }, today = new Date()) {
  if (preset !== 'custom') return { from: presetStart(preset, today), to: endOfDay(today) }
  const from = dayStart(custom.from)
  const to = dayStart(custom.to)
  return from && to && from <= to ? { from, to: endOfDay(to) } : null
}

export function monthStart(today = new Date()): InputDate {
  return toInputDate(new Date(today.getFullYear(), today.getMonth(), 1))
}
