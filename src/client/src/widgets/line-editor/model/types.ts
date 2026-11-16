/** One line of an editable document: a book, an optional reference quantity and the entered quantity. */
export interface EditorLine {
  book: string
  /** What the line is compared with: available at the sender, expected on hand, shipped. */
  reference?: number | null
  value: number | null
}
