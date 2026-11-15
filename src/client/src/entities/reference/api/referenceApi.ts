import { http, stub, type Created } from '@/shared/api'
import { remembered } from '@/shared/lib'
import type {
  Author, Category, Integration, IntegrationKind, Location, Promotion, Publisher, Role, Segment, Supplier, User,
} from '../model/types'

export const store = {
  authors: remembered<Author>('authors'),
  publishers: remembered<Publisher>('publishers'),
  categories: remembered<Category>('categories'),
  suppliers: remembered<Supplier>('suppliers'),
  locations: remembered<Location>('locations'),
  roles: remembered<Role>('roles'),
  users: remembered<User>('users'),
  segments: remembered<Segment>('segments'),
  integrations: remembered<Integration>('integrations'),
  promotions: remembered<Promotion>('promotions'),
}

/** Saves what the server created, so lists can show it: the API has no list endpoints yet (GAP-03, GAP-10). */
async function createRemembered<T extends { id: string }>(
  call: Promise<Created>, keep: { save: (item: T) => void }, item: Omit<T, 'id'>,
) {
  const { id } = await call
  keep.save({ ...item, id } as T)
  return id
}

function update<T extends { id: string }>(keep: { find: (id: string) => T | undefined; save: (item: T) => void }, id: string, patch: Partial<T>) {
  const existing = keep.find(id)
  if (existing) keep.save({ ...existing, ...patch })
}

export const referenceApi = {
  list: {
    authors: () => stub('GAP-03', store.authors.all),
    publishers: () => stub('GAP-03', store.publishers.all),
    categories: () => stub('GAP-03', store.categories.all),
    suppliers: () => stub('GAP-03', store.suppliers.all),
    locations: () => stub('GAP-03', store.locations.all),
    roles: () => stub('GAP-10', store.roles.all),
    users: () => stub('GAP-10', store.users.all),
    segments: () => stub('GAP-12', store.segments.all),
    integrations: () => stub('GAP-10', store.integrations.all),
    promotions: () => stub('GAP-12', store.promotions.all),
  },

  createAuthor: (name: string) => createRemembered<Author>(http.post('authors', { name }), store.authors, { name, active: true }),
  renameAuthor: async (id: string, name: string) => { await http.put(`authors/${id}`, { name }); update(store.authors, id, { name }) },
  setAuthorActive: async (id: string, active: boolean) => { await http.put(`authors/${id}/active`, { active }); update(store.authors, id, { active }) },

  createPublisher: (name: string) => createRemembered<Publisher>(http.post('publishers', { name }), store.publishers, { name, active: true }),
  renamePublisher: async (id: string, name: string) => { await http.put(`publishers/${id}`, { name }); update(store.publishers, id, { name }) },
  setPublisherActive: async (id: string, active: boolean) => { await http.put(`publishers/${id}/active`, { active }); update(store.publishers, id, { active }) },

  createCategory: (name: string) => createRemembered<Category>(http.post('categories', { name }), store.categories, { name }),
  renameCategory: async (id: string, name: string) => { await http.put(`categories/${id}`, { name }); update(store.categories, id, { name }) },

  createSupplier: (name: string, contactInfo: string | null) =>
    createRemembered<Supplier>(http.post('suppliers', { name, contactInfo }), store.suppliers, { name, contactInfo, active: true }),
  updateSupplier: async (id: string, name: string, contactInfo: string | null) => {
    await http.put(`suppliers/${id}`, { name, contactInfo }); update(store.suppliers, id, { name, contactInfo })
  },
  setSupplierActive: async (id: string, active: boolean) => { await http.put(`suppliers/${id}/active`, { active }); update(store.suppliers, id, { active }) },

  createLocation: (name: string, type: Location['type'], address: string) =>
    createRemembered<Location>(http.post('locations', { name, type, address }), store.locations, { name, type, address, active: true }),
  updateLocation: async (id: string, name: string, address: string) => {
    await http.put(`locations/${id}`, { name, address }); update(store.locations, id, { name, address })
  },
  setLocationActive: async (id: string, active: boolean) => { await http.put(`locations/${id}/active`, { active }); update(store.locations, id, { active }) },
  /** Locations seen through /auth/me are remembered too, so their names resolve elsewhere. */
  rememberLocation: (location: Location) => store.locations.save(location),

  createRole: (name: string, permissions: string[]) =>
    createRemembered<Role>(http.post('roles', { name, permissions }), store.roles, { name, permissions }),
  updateRole: async (id: string, name: string, permissions: string[]) => {
    await http.put(`roles/${id}`, { name, permissions }); update(store.roles, id, { name, permissions })
  },

  createUser: (login: string, password: string, roles: string[], locations: string[]) =>
    createRemembered<User>(http.post('users', { login, password, roles, locations }), store.users, { name: login, roles, locations, blocked: false }),
  changeUserAccess: async (id: string, roles: string[], locations: string[]) => {
    await http.put(`users/${id}/access`, { roles, locations }); update(store.users, id, { roles, locations })
  },
  blockUser: async (id: string) => { await http.post(`users/${id}/block`); update(store.users, id, { blocked: true }) },
  unblockUser: async (id: string) => { await http.post(`users/${id}/unblock`); update(store.users, id, { blocked: false }) },

  createSegment: (name: string, description: string | null) =>
    createRemembered<Segment>(http.post('segments', { name, description }), store.segments, { name, description }),
  updateSegment: async (id: string, name: string, description: string | null) => {
    await http.put(`segments/${id}`, { name, description }); update(store.segments, id, { name, description })
  },

  createIntegration: (kind: IntegrationKind, name: string) =>
    createRemembered<Integration>(http.post('integrations', { kind, name }), store.integrations, { kind, name, enabled: true }),
  setIntegrationEnabled: async (id: string, enabled: boolean) => {
    await http.put(`integrations/${id}/enabled`, { enabled }); update(store.integrations, id, { enabled })
  },

  createPromotion: (promotion: Omit<Promotion, 'id'>) =>
    createRemembered<Promotion>(http.post('promotions', {
      name: promotion.name, from: promotion.from, to: promotion.to,
      condition: { book: promotion.book, category: promotion.category, minimumQuantity: promotion.minimumQuantity },
      discountPercent: promotion.discountPercent, priority: promotion.priority,
    }), store.promotions, promotion),
}
