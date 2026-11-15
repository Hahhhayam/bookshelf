/** Personal data is hidden until asked for (Customer artboard): «+380 67 ••• •• 08», «i.sav•••@example.com». */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\s/g, '')
  return digits.length <= 6 ? '•••' : `${digits.slice(0, 6)} ••• •• ${digits.slice(-2)}`
}

export function maskEmail(email: string): string {
  const [local = '', domain = ''] = email.split('@')
  return `${local.slice(0, Math.min(5, Math.max(1, local.length - 2)))}•••@${domain}`
}

export function maskCard(card: string): string {
  return `•••• ${card.slice(-4)}`
}
