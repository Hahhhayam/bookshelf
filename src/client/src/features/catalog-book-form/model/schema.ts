import { z } from 'zod'
import { uah } from '@/shared/api'
import { compactIsbn, isValidIsbn, type BookCard, type BookDraft } from '@/entities/book'

export const bookFormSchema = z.object({
  title: z.string().trim().min(1, 'Вкажіть назву'),
  itemType: z.enum(['Book', 'Other']),
  isbn: z.string().trim().refine((v) => v === '' || isValidIsbn(v), 'ISBN некоректний: перевірте цифри'),
  barcode: z.string().trim().min(1, 'Вкажіть штрихкод'),
  category: z.string({ error: 'Оберіть категорію' }).min(1, 'Оберіть категорію'),
  authors: z.array(z.string()),
  publisher: z.string().nullable(),
  price: z.number({ error: 'Вкажіть ціну' }).min(0, 'Ціна не може бути від’ємною'),
}).refine((v) => v.itemType !== 'Book' || v.authors.length > 0, {
  path: ['authors'], message: 'Додайте хоча б одного автора',
})

export type BookFormValues = z.infer<typeof bookFormSchema>

export const emptyBook: BookFormValues = {
  title: '', itemType: 'Book', isbn: '', barcode: '', category: '', authors: [], publisher: null, price: Number.NaN,
}

export function toDraft(values: BookFormValues): BookDraft {
  return {
    title: values.title, itemType: values.itemType, barcode: values.barcode, category: values.category,
    authors: values.authors, publisher: values.publisher, isbn: values.isbn ? compactIsbn(values.isbn) : null,
    price: uah(values.price),
  }
}

export function fromCard(card: BookCard): BookFormValues {
  return {
    title: card.title, itemType: card.itemType, isbn: card.isbn ?? '', barcode: card.barcode, category: card.category,
    authors: card.authors, publisher: card.publisher, price: card.price.amount,
  }
}
