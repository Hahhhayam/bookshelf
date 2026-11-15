import type { ReactNode } from 'react'
import type { PermissionCode } from '@/shared/lib'

export interface NavItem {
  label: string
  to: string
  icon: ReactNode
  /** Shown to holders of any of these; none means everyone signed in. */
  anyOf?: PermissionCode[]
  end?: boolean
}

export interface NavGroup {
  title: string | null
  items: NavItem[]
}
