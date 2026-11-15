import { local, readJson, writeJson } from '@/shared/lib'

/**
 * What this browser already put into the customer's server cart. The server cart only grows and survives a failed
 * order (B-21), so a retried checkout sends only the difference instead of adding every line again.
 */
const key = (customer: string) => `bookshelf.shop.sent.${customer}`

export const sentLines = {
  read: (customer: string): Record<string, number> => readJson<Record<string, number>>(local, key(customer), {}),
  write: (customer: string, sent: Record<string, number>) => writeJson(local, key(customer), sent),
  clear: (customer: string) => local.remove(key(customer)),
}
