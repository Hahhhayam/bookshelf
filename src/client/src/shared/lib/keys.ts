/** A fresh operation key; the till keeps one per receipt so a resend after a lost connection posts only once. */
export function newKey(prefix: string): string {
  return `${prefix}-${randomId()}`
}

/** `crypto.randomUUID` exists only in secure contexts (HTTPS/localhost); the UI is also served over plain HTTP. */
function randomId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')
  const variant = '89ab'.charAt(parseInt(hex.charAt(16), 16) & 3)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20)}`
}
