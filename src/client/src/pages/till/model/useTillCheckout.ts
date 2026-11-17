import { useState } from 'react'
import type { ReceiptControls } from '@/features/till-receipt'
import {
  change, describeFailure, toPayments, useCompleteSale, type ClosedSale, type PaymentFailure, type PaymentPlan,
} from '@/features/till-payment'

/**
 * Posting the receipt. Every attempt for this receipt sends its one operation key, so «Спробувати зараз» after a
 * lost answer cannot post twice; the key changes only after a success (UI_Design.md §4).
 */
export function useTillCheckout(locationId: string, controls: ReceiptControls) {
  const { receipt, renew } = controls
  const complete = useCompleteSale()
  const [failure, setFailure] = useState<PaymentFailure | null>(null)
  const [lastPlan, setLastPlan] = useState<PaymentPlan | null>(null)
  const [closed, setClosed] = useState<ClosedSale | null>(null)

  function pay(plan: PaymentPlan) {
    setLastPlan(plan)
    setFailure(null)
    const payments = toPayments(plan)
    const items = receipt.lines.map(({ book, quantity, manualDiscount }) => ({ book, quantity, manualDiscount }))
    complete.mutate(
      { key: receipt.key, location: locationId, customer: receipt.customer?.id ?? null, items, payments },
      {
        onSuccess: ({ id }) => {
          setClosed({
            id, at: new Date().toISOString(), total: plan.total, change: change(plan.total, plan.tender), payments,
            items: items.reduce((sum, l) => sum + l.quantity, 0), customerName: receipt.customer?.name ?? null,
          })
          renew()
        },
        onError: (error) => setFailure(describeFailure(error)),
      },
    )
  }

  return {
    pay,
    retry: () => { if (lastPlan) pay(lastPlan) },
    busy: complete.isPending,
    failure,
    dismissFailure: () => setFailure(null),
    closed,
    finish: () => setClosed(null),
  }
}
