import type { Money } from '@/shared/api'

const locale = 'uk-UA'

const moneyFormat = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** «1 431,50 ₴»: two decimals, a non-breaking space before the currency sign. */
export function formatMoney(money: Money | null | undefined): string {
  if (!money) return '—'
  const sign = money.currency === 'UAH' ? '₴' : money.currency
  return `${moneyFormat.format(money.amount)} ${sign}`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value))
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(new Date(value))
}

/** «щойно», «12 хв тому», «3 год тому», else the date: for "last changed" columns. */
export function formatAgo(value: string | null | undefined, now = Date.now()): string {
  if (!value) return '—'
  const minutes = Math.round((now - new Date(value).getTime()) / 60_000)
  if (minutes < 1) return 'щойно'
  if (minutes < 60) return `${minutes} хв тому`
  if (minutes < 24 * 60) return `${Math.round(minutes / 60)} год тому`
  return formatDateTime(value)
}

export function minutesSince(value: string | null | undefined, now = Date.now()): number {
  return value ? Math.round((now - new Date(value).getTime()) / 60_000) : 0
}

/** «Олена Ткачук» → «ОТ». */
export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]!.toUpperCase()).join('')
}

/** A short readable form of a GUID for tables: its first block. */
export function shortId(id: string): string {
  return id.split('-')[0]!.toUpperCase()
}

const pluralRules = new Intl.PluralRules(locale)

/** The Ukrainian word form for a count: `plural(3, ['книжка', 'книжки', 'книжок'])` → «книжки». */
export function plural(count: number, [one, few, many]: readonly [one: string, few: string, many: string]): string {
  const rule = pluralRules.select(count)
  if (rule === 'one') return one
  return rule === 'many' ? many : few
}

/** Whole days past an expected date, for «Прострочено на N днів». */
export function overdueDays(expectedDate: string, now = new Date()): number {
  const expected = new Date(`${expectedDate.slice(0, 10)}T00:00:00`)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(0, Math.round((today.getTime() - expected.getTime()) / 86_400_000))
}

export function overdueText(expectedDate: string): string {
  const days = overdueDays(expectedDate)
  return `Прострочено на ${days} ${plural(days, ['день', 'дні', 'днів'])}`
}

/** «12 хв», «1 год 05 хв», «2 дн». */
export function formatWaited(minutes: number): string {
  if (minutes < 60) return `${Math.max(minutes, 0)} хв`
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} год ${String(minutes % 60).padStart(2, '0')} хв`
  return `${Math.floor(minutes / (24 * 60))} дн`
}

/** A day as the date input holds it: «2026-11-15», in local time. */
export type InputDate = string

const pad = (n: number) => String(n).padStart(2, '0')

export const toInputDate = (date: Date): InputDate => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)

/** Local midnight of an input day; null when the text is not a whole date. */
export function dayStart(value: InputDate): Date | null {
  const [y, m, d] = value.split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : null
}

export function dayEnd(value: InputDate): Date | null {
  const start = dayStart(value)
  return start && endOfDay(start)
}
