import { useState } from 'react'

export interface DraftLine {
  book: string
  quantity: number | null
}

/** The lines of a transfer being prepared: a scan adds a copy, typing sets the quantity. */
export function useTransferDraft() {
  const [lines, setLines] = useState<DraftLine[]>([])
  return {
    lines,
    add: (book: string) => setLines((current) => current.some((line) => line.book === book)
      ? current.map((line) => (line.book === book ? { ...line, quantity: (line.quantity ?? 0) + 1 } : line))
      : [{ book, quantity: 1 }, ...current]),
    set: (book: string, quantity: number | null) =>
      setLines((current) => current.map((line) => (line.book === book ? { ...line, quantity } : line))),
    remove: (book: string) => setLines((current) => current.filter((line) => line.book !== book)),
  }
}
