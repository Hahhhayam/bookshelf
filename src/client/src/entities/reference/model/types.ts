export interface Named {
  id: string
  name: string
}

export type ReferenceKind =
  | 'authors' | 'publishers' | 'categories' | 'suppliers' | 'locations'
  | 'roles' | 'users' | 'segments' | 'integrations' | 'promotions'

export interface Author extends Named { active: boolean }
export interface Publisher extends Named { active: boolean }
export type Category = Named
export interface Supplier extends Named { contactInfo: string | null; active: boolean }
export interface Location extends Named { type: 'Store' | 'Warehouse' | 'CentralWarehouse'; address: string; active: boolean }
export interface Role extends Named { permissions: string[] }
/** `name` is the login. */
export interface User extends Named { roles: string[]; locations: string[]; blocked: boolean }
export interface Segment extends Named { description: string | null }
export type IntegrationStatus = 'Healthy' | 'Failed'
export interface Integration extends Named {
  kind: IntegrationKind
  enabled: boolean
  status: IntegrationStatus
  lastError: string | null
  lastErrorAt: string | null
  lastExchangeAt: string | null
}
export interface Promotion extends Named {
  from: string
  to: string
  discountPercent: number
  priority: number
  book: string | null
  category: string | null
  minimumQuantity: number
  /** A personal offer (FR-15): only customers of this segment, or this one customer, get it at the till. */
  segment: string | null
  customer: string | null
}

/** How any employee names a user id: histories, "last changed by", the audit log. */
export interface UserLogin {
  id: string
  login: string
}

export type IntegrationKind = 'Payment' | 'OnlineShop' | 'Accounting' | 'Notifications'
