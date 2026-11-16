/** ISBN-13 or ISBN-10 digits, the way the scan field receives them. */
const isbnLike = /^(97[89])?\d{9}[\dX]$/i

/** ISBN without separators, upper-cased, as the server stores it. */
export function compactIsbn(value: string): string {
  return value.replace(/[-\s]/g, '').toUpperCase()
}

/** A scanned or typed code that should go to the ISBN filter rather than to text search. */
export function looksLikeIsbn(value: string): boolean {
  return isbnLike.test(compactIsbn(value))
}

/** The same checksum rules as the server's `Isbn` value object, so a typo is caught next to the field. */
export function isValidIsbn(value: string): boolean {
  const s = compactIsbn(value)
  if (s.length === 13) {
    return /^\d{13}$/.test(s) && [...s].reduce((sum, c, i) => sum + Number(c) * (i % 2 === 0 ? 1 : 3), 0) % 10 === 0
  }
  if (s.length === 10) {
    return /^\d{9}[\dX]$/.test(s) && [...s].reduce((sum, c, i) => sum + (c === 'X' ? 10 : Number(c)) * (10 - i), 0) % 11 === 0
  }
  return false
}
