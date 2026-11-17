import { ApiError } from '@/shared/api'
import { errorMessage } from '@/shared/ui'

export type PaymentFailure =
  | { kind: 'declined' }
  | { kind: 'rule'; message: string }
  | { kind: 'unconfirmed' }
  | { kind: 'other'; message: string }

/**
 * A refused card is 402; a broken rule is 422, explained by its error code. No answer or a 5xx may still have posted the
 * sale, so the receipt is resent with the same key.
 */
export function describeFailure(error: unknown): PaymentFailure {
  if (!(error instanceof ApiError) || error.status >= 500) return { kind: 'unconfirmed' }
  if (error.status === 402) return { kind: 'declined' }
  if (error.status === 422) return { kind: 'rule', message: errorMessage(error) }
  return { kind: 'other', message: errorMessage(error) }
}
