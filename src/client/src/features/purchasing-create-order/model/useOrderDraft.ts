import { useState } from 'react'
import type { BookHit } from '@/entities/book'

export interface DraftLine {
  book: string
  title: string
  quantity: number
  /** Purchase price in UAH; the catalog price is only a starting point. */
  price: number
}

export interface OrderDraft {
  supplier: string | null
  expectedDate: string
  lines: DraftLine[]
}

export interface DraftErrors {
  supplier?: string
  expectedDate?: string
  lines?: string
}

function today(): string {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export function validateDraft(draft: OrderDraft): DraftErrors {
  const errors: DraftErrors = {}
  if (!draft.supplier) errors.supplier = 'Оберіть постачальника'
  if (!draft.expectedDate) errors.expectedDate = 'Вкажіть дату поставки'
  else if (draft.expectedDate < today()) errors.expectedDate = 'Дата поставки не може бути в минулому'
  if (draft.lines.length === 0) errors.lines = 'Додайте хоча б одну книгу'
  else if (draft.lines.some((line) => line.quantity < 1 || line.price <= 0)) errors.lines = 'Кількість і ціна мають бути більші за нуль'
  return errors
}

/** A purchase order being put together: the server takes a book once, so scanning it again adds to its line. */
export function useOrderDraft() {
  const [draft, setDraft] = useState<OrderDraft>({ supplier: null, expectedDate: '', lines: [] })

  function addBook(hit: BookHit) {
    setDraft((d) => {
      const existing = d.lines.find((line) => line.book === hit.id)
      const lines = existing
        ? d.lines.map((line) => (line.book === hit.id ? { ...line, quantity: line.quantity + 1 } : line))
        : [...d.lines, { book: hit.id, title: hit.title, quantity: 1, price: hit.price.amount }]
      return { ...d, lines }
    })
  }

  function updateLine(book: string, patch: Partial<Pick<DraftLine, 'quantity' | 'price'>>) {
    setDraft((d) => ({ ...d, lines: d.lines.map((line) => (line.book === book ? { ...line, ...patch } : line)) }))
  }

  return {
    draft,
    setSupplier: (supplier: string | null) => setDraft((d) => ({ ...d, supplier })),
    setExpectedDate: (expectedDate: string) => setDraft((d) => ({ ...d, expectedDate })),
    addBook,
    updateLine,
    removeLine: (book: string) => setDraft((d) => ({ ...d, lines: d.lines.filter((line) => line.book !== book) })),
    minDate: today(),
  }
}
