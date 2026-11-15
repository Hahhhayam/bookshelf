/** Permission codes, as the server's `Permissions` class defines them. */
export const Perm = {
  CatalogEdit: 'catalog.edit',
  PriceChange: 'catalog.price',
  SalesCreate: 'sales.create',
  SalesDiscount: 'sales.discount',
  SalesCancel: 'sales.cancel',
  ReturnsCreate: 'returns.create',
  ReturnsConfirm: 'returns.confirm',
  StockAdjust: 'stock.adjust',
  TransfersManage: 'transfers.manage',
  InventoryCountManage: 'inventory.count',
  InventoryCountApprove: 'inventory.approve',
  WriteOffCreate: 'writeoff.create',
  OrdersManage: 'orders.manage',
  PurchasingManage: 'purchasing.manage',
  ReceivingConfirm: 'receiving.confirm',
  CrmManage: 'crm.manage',
  PromotionsManage: 'promotions.manage',
  UsersManage: 'users.manage',
  LocationsManage: 'locations.manage',
  IntegrationsManage: 'integrations.manage',
  AuditView: 'audit.view',
  ReportsView: 'reports.view',
  ReportsChainWide: 'reports.chain',
  IntegrationsReport: 'integrations.report',
} as const

export type PermissionCode = (typeof Perm)[keyof typeof Perm]

/** True when the user holds at least one of the codes, as the server's `[RequirePermission(a, b)]` does. */
export function hasPermission(granted: readonly string[], ...anyOf: PermissionCode[]): boolean {
  return anyOf.length === 0 || anyOf.some((code) => granted.includes(code))
}
