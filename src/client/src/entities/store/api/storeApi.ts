import { http } from '@/shared/api'
import type { Store } from '../model/types'

export const storeApi = {
  list: () => http.get<Store[]>('stores'),
}
