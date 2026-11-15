import { useState } from 'react'
import type { BookHit } from '@/entities/book'
import type { ReceivingLine } from './receivingLines'

/**
 * The lines of a delivery being received. Scanning a book adds one to its line, or opens a line for a book the
 * order did not have. Mount with a `key` per delivery so the initial lines apply.
 */
export function useReceivingLines(initial: ReceivingLine[]) {
  const [lines, setLines] = useState(initial)
  const [active, setActive] = useState<string | null>(null)

  function scan(hit: BookHit) {
    setLines((current) => current.some((l) => l.book === hit.id)
      ? current.map((l) => (l.book === hit.id ? { ...l, now: (l.now ?? 0) + 1 } : l))
      : [...current, { book: hit.id, title: hit.title, ordered: 0, alreadyReceived: 0, now: 1 }])
    setActive(hit.id)
  }

  function setNow(book: string, now: number | null) {
    setLines((current) => current.map((l) => (l.book === book ? { ...l, now } : l)))
    setActive(book)
  }

  /** An extra line opened by a scan can be dropped again; order lines stay. */
  function remove(book: string) {
    setLines((current) => current.filter((l) => l.book !== book || l.ordered > 0))
  }

  return { lines, active, scan, setNow, remove }
}
