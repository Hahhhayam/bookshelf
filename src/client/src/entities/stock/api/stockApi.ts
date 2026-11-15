import { http, type Created } from '@/shared/api'

export interface StockLine {
  book: string
  onHand: number
  reserved: number
  available: number
  minimum: number
  belowMinimum: boolean
}

export interface ItemQuantity {
  book: string
  quantity: number
}

export const stockApi = {
  atLocation: (location: string, filter: { book?: string; belowMinimum?: boolean } = {}) =>
    http.get<StockLine[]>(`locations/${location}/stock`, { query: filter }),
  adjust: (location: string, book: string, newOnHand: number, reason: string) =>
    http.post('stock/adjustments', { location, book, newOnHand, reason }),
  setMinimum: (location: string, book: string, minimum: number) =>
    http.put(`locations/${location}/stock/${book}/minimum`, { minimum }),
  reserve: (location: string, book: string, quantity: number, holdMinutes: number) =>
    http.post<Created>('stock/reservations', { location, book, quantity, holdMinutes }),
  release: (location: string, book: string, reservation: string) =>
    http.delete(`locations/${location}/stock/${book}/reservations/${reservation}`),
  writeOff: (location: string, reason: string, items: ItemQuantity[]) =>
    http.post<Created>('write-offs', { location, reason, items }),
}
