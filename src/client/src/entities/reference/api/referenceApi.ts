import { http, type Created } from '@/shared/api'
import type {
  Author, Category, Integration, IntegrationKind, Location, Promotion, Publisher, Role, Segment, Supplier, User,
  UserLogin,
} from '../model/types'

interface UserDto {
  id: string
  login: string
  status: 'Active' | 'Blocked'
  roles: string[]
  locations: string[]
}

interface PromotionDto {
  id: string
  name: string
  from: string
  to: string
  condition: {
    book: string | null
    category: string | null
    minimumQuantity: number
    segment: string | null
    customer: string | null
  }
  discountPercent: number
  priority: number
}

const toUser = ({ id, login, status, roles, locations }: UserDto): User =>
  ({ id, name: login, roles, locations, blocked: status === 'Blocked' })

const toPromotion = ({ condition, ...promotion }: PromotionDto): Promotion => ({ ...promotion, ...condition })

async function created(call: Promise<Created>) {
  return (await call).id
}

export const referenceApi = {
  list: {
    authors: () => http.get<Author[]>('authors'),
    publishers: () => http.get<Publisher[]>('publishers'),
    categories: () => http.get<Category[]>('categories'),
    suppliers: () => http.get<Supplier[]>('suppliers'),
    locations: () => http.get<Location[]>('locations'),
    roles: () => http.get<Role[]>('roles'),
    users: async () => (await http.get<UserDto[]>('users')).map(toUser),
    segments: () => http.get<Segment[]>('segments'),
    integrations: () => http.get<Integration[]>('integrations'),
    promotions: async () => (await http.get<PromotionDto[]>('promotions')).map(toPromotion),
  },
  logins: () => http.get<UserLogin[]>('users/logins'),

  createAuthor: (name: string) => created(http.post<Created>('authors', { name })),
  renameAuthor: (id: string, name: string) => http.put(`authors/${id}`, { name }),
  setAuthorActive: (id: string, active: boolean) => http.put(`authors/${id}/active`, { active }),

  createPublisher: (name: string) => created(http.post<Created>('publishers', { name })),
  renamePublisher: (id: string, name: string) => http.put(`publishers/${id}`, { name }),
  setPublisherActive: (id: string, active: boolean) => http.put(`publishers/${id}/active`, { active }),

  createCategory: (name: string) => created(http.post<Created>('categories', { name })),
  renameCategory: (id: string, name: string) => http.put(`categories/${id}`, { name }),

  createSupplier: (name: string, contactInfo: string | null) =>
    created(http.post<Created>('suppliers', { name, contactInfo })),
  updateSupplier: (id: string, name: string, contactInfo: string | null) => http.put(`suppliers/${id}`, { name, contactInfo }),
  setSupplierActive: (id: string, active: boolean) => http.put(`suppliers/${id}/active`, { active }),

  createLocation: (name: string, type: Location['type'], address: string) =>
    created(http.post<Created>('locations', { name, type, address })),
  updateLocation: (location: Location, name: string, address: string) =>
    http.put(`locations/${location.id}`, { name, address }),
  setLocationActive: (location: Location, active: boolean) => http.put(`locations/${location.id}/active`, { active }),

  createRole: (name: string, permissions: string[]) => created(http.post<Created>('roles', { name, permissions })),
  updateRole: (id: string, name: string, permissions: string[]) => http.put(`roles/${id}`, { name, permissions }),

  createUser: (login: string, password: string, roles: string[], locations: string[]) =>
    created(http.post<Created>('users', { login, password, roles, locations })),
  changeUserAccess: (id: string, roles: string[], locations: string[]) => http.put(`users/${id}/access`, { roles, locations }),
  blockUser: (id: string) => http.post(`users/${id}/block`),
  unblockUser: (id: string) => http.post(`users/${id}/unblock`),

  createSegment: (name: string, description: string | null) =>
    created(http.post<Created>('segments', { name, description })),
  updateSegment: (id: string, name: string, description: string | null) => http.put(`segments/${id}`, { name, description }),

  createIntegration: (kind: IntegrationKind, name: string) => created(http.post<Created>('integrations', { kind, name })),
  setIntegrationEnabled: (id: string, enabled: boolean) => http.put(`integrations/${id}/enabled`, { enabled }),

  createPromotion: (promotion: Omit<Promotion, 'id'>) =>
    created(http.post<Created>('promotions', {
      name: promotion.name, from: promotion.from, to: promotion.to,
      condition: {
        book: promotion.book, category: promotion.category, minimumQuantity: promotion.minimumQuantity,
        segment: promotion.segment, customer: promotion.customer,
      },
      discountPercent: promotion.discountPercent, priority: promotion.priority,
    })),
}
