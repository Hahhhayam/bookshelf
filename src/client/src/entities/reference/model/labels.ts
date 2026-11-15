// Keys mirror LocationType (entities/viewer) and IntegrationKind (entities/reference); an entity cannot import them.
type LocationKind = 'Store' | 'Warehouse' | 'CentralWarehouse'
type IntegrationKindCode = 'Payment' | 'OnlineShop' | 'Accounting' | 'Notifications'

export const locationTypeLabel: Record<LocationKind, string> = {
  Store: 'Магазин',
  Warehouse: 'Склад',
  CentralWarehouse: 'Центральний склад',
}

export const integrationKindLabel: Record<IntegrationKindCode, string> = {
  Payment: 'Платіжний сервіс',
  OnlineShop: 'Онлайн-магазин',
  Accounting: 'Бухгалтерія',
  Notifications: 'Сповіщення',
}

export const locationTypes = Object.keys(locationTypeLabel) as LocationKind[]
export const integrationKinds = Object.keys(integrationKindLabel) as IntegrationKindCode[]
