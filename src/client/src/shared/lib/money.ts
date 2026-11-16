import { uah, type Money } from '@/shared/api'

/** Money arithmetic runs in kopecks, so parts add up exactly to the total. */
export const toCents = (money: Money | number) => Math.round((typeof money === 'number' ? money : money.amount) * 100)

export const fromCents = (cents: number): Money => uah(cents / 100)

/** «1 431,50» as a person types it: spaces ignored, comma or dot. Empty is zero; anything else invalid is null. */
export function parseAmount(text: string): number | null {
  const compact = text.replace(/[\s ]/g, '').replace(',', '.')
  if (compact === '') return 0
  const value = Number(compact)
  return Number.isFinite(value) && value >= 0 ? toCents(value) : null
}

export const formatAmount = (cents: number) => (cents / 100).toFixed(2).replace('.', ',')
