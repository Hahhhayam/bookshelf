import { http } from '@/shared/api'
import type { Cart } from '../model/types'

const items = (customer: string) => `customers/${customer}/cart/items`

export const cartApi = {
  get: (customer: string) => http.get<Cart>(`customers/${customer}/cart`),
  add: (customer: string, book: string, quantity: number) => http.post(items(customer), { book, quantity }),
  setQuantity: (customer: string, book: string, quantity: number) => http.put(`${items(customer)}/${book}`, { quantity }),
  remove: (customer: string, book: string) => http.delete(`${items(customer)}/${book}`),
}
