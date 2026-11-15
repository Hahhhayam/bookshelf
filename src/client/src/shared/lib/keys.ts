/** A fresh operation key; the till keeps one per receipt so a resend after a lost connection posts only once. */
export function newKey(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}
