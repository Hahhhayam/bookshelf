import { useBookCards } from '@/entities/book'
import { useMissingBooks } from '@/entities/purchase-order'
import { useLocationStock } from '@/entities/stock'

/** A book to reorder: enough to bring the stock back up to its minimum, at the catalog price as a start. */
export interface NeedLine {
  book: string
  title: string
  quantity: number
  price: number
}

/**
 * Need forming (table 2.1): the books below their minimum at the location and the open requests for books the
 * chain does not have. Only the first can become order lines; a missing book has to be added to the catalog first.
 */
export function useNeed(location: string | undefined) {
  const stock = useLocationStock(location, { belowMinimum: true })
  const missing = useMissingBooks(location)
  const lowLines = stock.data ?? []
  const cards = useBookCards(lowLines.map((line) => line.book), 5 * 60_000)
  const lines: NeedLine[] = lowLines.map((line) => ({
    book: line.book,
    title: cards.cardOf(line.book)?.title ?? '…',
    quantity: Math.max(line.minimum - line.onHand, 1),
    price: cards.cardOf(line.book)?.price.amount ?? 0,
  }))
  return { stock, missing, lines, cardsPending: cards.isPending }
}
