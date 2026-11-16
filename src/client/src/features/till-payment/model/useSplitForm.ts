import { useCallback, useState } from 'react'
import { formatAmount, parseAmount } from '@/shared/lib'
import { noTender, remaining, type PaymentPlan, type Tender, type TenderMethod } from './paymentPlan'

const empty: Record<TenderMethod, string> = { Bonus: '', GiftCertificate: '', Cash: '', Card: '' }

/** The split dialog's fields as typed, and the plan they make. */
export function useSplitForm(initialTotal: number) {
  const [fields, setFields] = useState(empty)
  const [certificateNumber, setCertificateNumber] = useState('')
  const [totalText, setTotalText] = useState(formatAmount(initialTotal))
  const reset = useCallback((nextTotal: number) => {
    setFields(empty)
    setCertificateNumber('')
    setTotalText(formatAmount(nextTotal))
  }, [])

  const parsed = Object.fromEntries(
    (Object.keys(fields) as TenderMethod[]).map((m) => [m, parseAmount(fields[m])]),
  ) as Record<TenderMethod, number | null>
  const tender: Tender = { ...noTender }
  for (const m of Object.keys(parsed) as TenderMethod[]) tender[m] = parsed[m] ?? 0
  const total = parseAmount(totalText) ?? 0
  const plan: PaymentPlan = { total, tender, certificateNumber }
  const invalid = (Object.keys(parsed) as TenderMethod[]).filter((m) => parsed[m] === null)

  return {
    fields, plan, invalid, totalText, certificateNumber,
    setField: (method: TenderMethod, value: string) => setFields((f) => ({ ...f, [method]: value })),
    /** Enter in a field: that field takes whatever is still left to pay. */
    fillRemaining: (method: TenderMethod) =>
      setFields((f) => ({ ...f, [method]: formatAmount(tender[method] + remaining(total, tender)) })),
    setCertificateNumber,
    setTotalText,
    reset,
  }
}
