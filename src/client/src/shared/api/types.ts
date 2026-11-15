/** Money as the API sends and receives it. */
export interface Money {
  amount: number
  currency: string
}

/** The body the API returns for a created resource. */
export interface Created {
  id: string
}

/** One step of a document's status history, as the cards return it. */
export interface HistoryEntry {
  from: string
  to: string
  at: string
  by: string
}

export const uah = (amount: number): Money => ({ amount, currency: 'UAH' })
