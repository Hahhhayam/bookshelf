/** Drilling down from a figure narrows the report to it (scenario 3.12 step 4): a store, a category or a book. */
export interface Drill {
  location: (id: string) => void
  category: (id: string) => void
  book: (id: string) => void
}
