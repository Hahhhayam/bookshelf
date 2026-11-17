import { http, type Created, type Money } from '@/shared/api'
import { compactIsbn, looksLikeIsbn } from '../model/isbn'
import type { BookCard, BookDraft, BookHit, BookSearch, PricePoint, RemovalMode } from '../model/types'

/** The server's limit on one `ids` lookup. */
const idsPerCall = 200

export const bookApi = {
  search: (query: BookSearch) => http.get<BookHit[]>('books', { query: { ...query } }),
  card: (id: string) => http.get<BookCard>(`books/${id}`),
  prices: (id: string) => http.get<PricePoint[]>(`books/${id}/prices`),

  /** Books by id, for lists that carry only ids; one call per {@link idsPerCall} ids. */
  byIds: async (ids: readonly string[]): Promise<BookHit[]> => {
    const chunks = Array.from({ length: Math.ceil(ids.length / idsPerCall) }, (_, i) => ids.slice(i * idsPerCall, (i + 1) * idsPerCall))
    const pages = await Promise.all(chunks.map((chunk) => http.get<BookHit[]>('books', { query: { ids: chunk } })))
    return pages.flat()
  },

  /**
   * The till's scan field: an ISBN-looking code goes to the ISBN filter; anything else to text search, which matches
   * an exact shop barcode as well as titles, so an exact barcode match wins over title matches.
   */
  findByCode: async (code: string): Promise<BookHit[]> => {
    if (looksLikeIsbn(code)) {
      const byIsbn = await http.get<BookHit[]>('books', { query: { isbn: compactIsbn(code) } }).catch(() => [])
      if (byIsbn.length > 0) return byIsbn
    }
    const hits = await http.get<BookHit[]>('books', { query: { text: code.trim() } })
    const byBarcode = hits.filter((hit) => hit.barcode === code.trim())
    return byBarcode.length > 0 ? byBarcode : hits
  },

  add: (draft: BookDraft) => http.post<Created>('books', draft),
  update: (id: string, draft: Omit<BookDraft, 'itemType' | 'isbn' | 'price'>) => http.put(`books/${id}`, draft),
  /** Without `effectiveFrom` the price applies at once. */
  changePrice: (id: string, newPrice: Money, effectiveFrom: string | null = null) =>
    http.post(`books/${id}/price`, { newPrice, effectiveFrom }),
  remove: (id: string) => http.delete<{ mode: RemovalMode }>(`books/${id}`),
  setActive: (id: string, active: boolean) => http.put(`books/${id}/active`, { active }),
}
