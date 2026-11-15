import { ApiError } from '@/shared/api'
import { errorMessage } from '@/shared/ui'

export type PaymentFailure =
  | { kind: 'declined' }
  | { kind: 'rule'; message: string; totalMismatch: boolean }
  | { kind: 'unconfirmed' }
  | { kind: 'other'; message: string }

/**
 * A refused card is 402; a broken rule is 422 with the server's message. The server's "payments must add up to the
 * receipt total" is B-01: promotions the till could not price (GAP-05). No answer or a 5xx may still have posted the
 * sale, so the receipt is resent with the same key.
 */
export function describeFailure(error: unknown): PaymentFailure {
  if (!(error instanceof ApiError) || error.status >= 500) return { kind: 'unconfirmed' }
  if (error.status === 402) return { kind: 'declined' }
  if (error.status === 422) return { kind: 'rule', message: error.message, totalMismatch: /add up|total/i.test(error.message) }
  return { kind: 'other', message: errorMessage(error) }
}
