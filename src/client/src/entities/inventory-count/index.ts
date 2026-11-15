import { http, stub, type Created } from '@/shared/api'
import { local, readJson, writeJson } from '@/shared/lib'

/** A count started in this browser; the API cannot read counts back yet (GAP-08). */
export interface CountSession {
  id: string
  location: string
  startedAt: string
  status: 'Open' | 'Counted' | 'Approved'
  counted: Record<string, number>
}

const key = 'bookshelf.counts'

const all = () => readJson<CountSession[]>(local, key, [])
const save = (count: CountSession) => writeJson(local, key, [count, ...all().filter((c) => c.id !== count.id)])

export const countApi = {
  start: async (location: string) => {
    const { id } = await http.post<Created>('inventory-counts', { location })
    save({ id, location, startedAt: new Date().toISOString(), status: 'Open', counted: {} })
    return id
  },
  record: async (id: string, book: string, counted: number) => {
    await http.put(`inventory-counts/${id}/lines/${book}`, { counted })
    const count = all().find((c) => c.id === id)
    if (count) save({ ...count, counted: { ...count.counted, [book]: counted } })
  },
  complete: async (id: string) => {
    await http.post(`inventory-counts/${id}/complete`)
    const count = all().find((c) => c.id === id)
    if (count) save({ ...count, status: 'Counted' })
  },
  approve: async (id: string) => {
    await http.post(`inventory-counts/${id}/approve`)
    const count = all().find((c) => c.id === id)
    if (count) save({ ...count, status: 'Approved' })
  },
  list: () => stub('GAP-08', all),
  get: (id: string) => stub('GAP-08', () => all().find((c) => c.id === id) ?? null),
}
