import { http, type Created } from '@/shared/api'
import type { Shift } from '../model/types'

export const shiftApi = {
  current: (location: string) => http.get<Shift>(`locations/${location}/shift`),
  open: (location: string) => http.post<Created>(`locations/${location}/shifts`),
  close: (id: string) => http.post(`shifts/${id}/close`),
}
