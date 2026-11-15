import type { Named } from '@/shared/lib'

export type ReferenceKind =
  | 'authors' | 'publishers' | 'categories' | 'suppliers' | 'locations'
  | 'roles' | 'users' | 'segments' | 'integrations' | 'promotions'

export interface Author extends Named { active: boolean }
export interface Publisher extends Named { active: boolean }
export type Category = Named
export interface Supplier extends Named { contactInfo: string | null; active: boolean }
export interface Location extends Named { type: 'Store' | 'Warehouse' | 'CentralWarehouse'; address: string; active: boolean }
export interface Role extends Named { permissions: string[] }
export interface User extends Named { roles: string[]; locations: string[]; blocked: boolean }
export interface Segment extends Named { description: string | null }
export interface Integration extends Named { kind: IntegrationKind; enabled: boolean }
export interface Promotion extends Named {
  from: string
  to: string
  discountPercent: number
  priority: number
  book: string | null
  category: string | null
  minimumQuantity: number
}

export type IntegrationKind = 'Payment' | 'OnlineShop' | 'Accounting' | 'Notifications'
