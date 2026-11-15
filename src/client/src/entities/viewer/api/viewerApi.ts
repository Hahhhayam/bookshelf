import { http } from '@/shared/api'
import type { Viewer } from '../model/types'

export const viewerApi = {
  login: (login: string, password: string) =>
    http.post<{ token: string; expiresAt: string }>('auth/login', { login, password }),
  logout: () => http.post('auth/logout'),
  me: () => http.get<Viewer>('auth/me'),
}
