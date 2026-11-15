export type Preset = 'today' | 'week' | 'month' | 'quarter' | 'custom'

export const presets: { value: Preset; label: string }[] = [
  { value: 'today', label: 'Сьогодні' },
  { value: 'week', label: '7 днів' },
  { value: 'month', label: 'Місяць' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'custom', label: 'Свій' },
]

/** A day as the date input holds it: «2026-11-15», in local time. */
export type InputDate = string

const pad = (n: number) => String(n).padStart(2, '0')
export const toInputDate = (date: Date): InputDate => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

function fromInputDate(value: InputDate): Date | null {
  const [y, m, d] = value.split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : null
}

const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)

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
  const from = fromInputDate(custom.from)
  const to = fromInputDate(custom.to)
  return from && to && from <= to ? { from, to: endOfDay(to) } : null
}

export function monthStart(today = new Date()): InputDate {
  return toInputDate(new Date(today.getFullYear(), today.getMonth(), 1))
}
