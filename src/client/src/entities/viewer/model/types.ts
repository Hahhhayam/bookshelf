export type LocationType = 'Store' | 'Warehouse' | 'CentralWarehouse'

export interface ViewerLocation {
  id: string
  name: string
  type: LocationType
}

/** The signed-in employee, from GET /auth/me. */
export interface Viewer {
  id: string
  login: string
  permissions: string[]
  locations: ViewerLocation[]
}
