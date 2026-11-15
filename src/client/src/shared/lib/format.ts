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
