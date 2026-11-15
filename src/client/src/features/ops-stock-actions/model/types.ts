/** What the stock dialogs need to know about the line they act on. */
export interface StockTarget {
  book: string
  title: string
  onHand: number
  available: number
}
