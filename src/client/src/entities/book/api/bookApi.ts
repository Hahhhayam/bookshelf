import { http, type Created, type Money } from '@/shared/api'
import { compactIsbn, looksLikeIsbn } from '../model/isbn'
import type { BookCard, BookDraft, BookHit, BookSearch, PricePoint, RemovalMode } from '../model/types'

export const bookApi = {
  search: (query: BookSearch) => http.get<BookHit[]>('books', { query: { ...query } }),
  card: (id: string) => http.get<BookCard>(`books/${id}`),
  prices: (id: string) => http.get<PricePoint[]>(`books/${id}/prices`),

  /**
   * The till's scan field: an ISBN-looking code goes to the ISBN filter, anything else to text search. The API has
   * no barcode filter (API_GAPS.md, GAP-06), so a shop barcode that is not an ISBN is found only through its title.
   */
  findByCode: async (code: string): Promise<BookHit[]> => {
    if (looksLikeIsbn(code)) {
      const byIsbn = await http.get<BookHit[]>('books', { query: { isbn: compactIsbn(code) } }).catch(() => [])
      if (byIsbn.length > 0) return byIsbn
    }
    return http.get<BookHit[]>('books', { query: { text: code } })
  },

  add: (draft: BookDraft) => http.post<Created>('books', draft),
  update: (id: string, draft: Omit<BookDraft, 'itemType' | 'isbn' | 'price'>) => http.put(`books/${id}`, draft),
  changePrice: (id: string, newPrice: Money) => http.post(`books/${id}/price`, { newPrice }),
  remove: (id: string) => http.delete<{ mode: RemovalMode }>(`books/${id}`),
}
