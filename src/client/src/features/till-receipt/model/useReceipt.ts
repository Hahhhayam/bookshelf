import { useMemo, useReducer } from 'react'
import type { CustomerCard } from '@/entities/customer'
import { newKey } from '@/shared/lib'
import { emptyReceipt, receiptReducer } from './receiptReducer'
import type { ReceiptLine } from './types'

const receiptKey = (locationId: string) => newKey(`till-${locationId}`)

/**
 * The open receipt of the till. Its operation key is created when the receipt opens and survives failed attempts,
 * so a resend posts the sale only once (UI_Design.md §4); `renew` starts the next receipt with a fresh key.
 */
export function useReceipt(locationId: string) {
  const [receipt, dispatch] = useReducer(receiptReducer, locationId, (location) => emptyReceipt(receiptKey(location)))
  const actions = useMemo(() => ({
    add: (line: Omit<ReceiptLine, 'quantity'>) => dispatch({ type: 'add', line }),
    step: (index: number, delta: 1 | -1) => dispatch({ type: 'step', index, delta }),
    select: (index: number) => dispatch({ type: 'select', index }),
    move: (delta: 1 | -1) => dispatch({ type: 'move', delta }),
    remove: (index: number) => dispatch({ type: 'remove', index }),
    setCustomer: (customer: CustomerCard | null) => dispatch({ type: 'customer', customer }),
    renew: () => dispatch({ type: 'reset', key: receiptKey(locationId) }),
  }), [locationId])
  return { receipt, ...actions }
}

export type ReceiptControls = ReturnType<typeof useReceipt>
