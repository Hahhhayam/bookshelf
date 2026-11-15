import { referenceApi, type Location } from '@/entities/reference'

/**
 * A location known only from /auth/me is remembered before it is changed, so the local copy the lists read
 * (API_GAPS.md, GAP-03) follows the change. Only the Location fields are kept, whatever the caller passed.
 */
export function rememberBeforeChange({ id, name, type, address, active }: Location) {
  referenceApi.rememberLocation({ id, name, type, address, active })
}
