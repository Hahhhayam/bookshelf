import type { Payment } from '@/entities/sale'
import { formatMoney, fromCents } from '@/shared/lib'

export type TenderMethod = 'Bonus' | 'GiftCertificate' | 'Cash' | 'Card'

/** Amounts in kopecks per method; cash is what the customer handed over, change included. */
export type Tender = Record<TenderMethod, number>

export interface PaymentPlan {
  /** What the payments must add up to: the server's quoted total. */
  total: number
  tender: Tender
  certificateNumber: string
}

export const noTender: Tender = { Bonus: 0, GiftCertificate: 0, Cash: 0, Card: 0 }

export const tendered = (tender: Tender) => tender.Bonus + tender.GiftCertificate + tender.Cash + tender.Card

export const remaining = (total: number, tender: Tender) => Math.max(0, total - tendered(tender))

/** Only cash gives change; an overpaid card or certificate is an error, not change. */
export const change = (total: number, tender: Tender) => Math.min(tender.Cash, Math.max(0, tendered(tender) - total))

/** Why the plan cannot be posted yet, in the cashier's words; null when it can. */
/** `bonusAllowed`: kopecks the customer's bonuses may pay (from the quote), or null without a customer. */
export function planProblem(plan: PaymentPlan, bonusAllowed: number | null): string | null {
  const { total, tender } = plan
  if (total <= 0) return 'Сума до сплати має бути більшою за нуль.'
  if (remaining(total, tender) > 0) return `Залишилось сплатити ${formatMoney(fromCents(remaining(total, tender)))}.`
  if (tendered(tender) - tender.Cash > total) return 'Картка, бонуси й сертифікат разом більші за суму чека.'
  if (tender.Bonus > 0 && bonusAllowed === null) return 'Бонусами можна платити лише з клієнтом (F4).'
  if (bonusAllowed !== null && tender.Bonus > bonusAllowed) return `Бонусами можна списати лише ${formatMoney(fromCents(bonusAllowed))}.`
  if (tender.GiftCertificate > 0 && !plan.certificateNumber.trim()) return 'Вкажіть номер сертифіката.'
  return null
}

/** The payments the server takes: amounts equal the total exactly, and cash also says what was handed over. */
export function toPayments(plan: PaymentPlan): Payment[] {
  const rest = change(plan.total, plan.tender)
  const net: Tender = { ...plan.tender, Cash: plan.tender.Cash - rest }
  return (Object.keys(net) as TenderMethod[])
    .filter((method) => net[method] > 0)
    .map((method) => ({
      method,
      amount: fromCents(net[method]),
      giftCertificateNumber: method === 'GiftCertificate' ? plan.certificateNumber.trim() : null,
      tendered: method === 'Cash' && rest > 0 ? fromCents(plan.tender.Cash) : null,
    }))
}

export const wholeBy = (method: TenderMethod, total: number, certificateNumber = ''): PaymentPlan =>
  ({ total, tender: { ...noTender, [method]: total }, certificateNumber })
