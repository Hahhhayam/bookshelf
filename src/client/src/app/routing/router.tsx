import type { ComponentType } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router'
import { Perm, type PermissionCode } from '@/shared/lib'
import { ShopShell } from '@/widgets/shop-shell'
import { StaffShell } from '@/widgets/staff-shell'
import { RequirePermission, RequireSession } from './guards'
import { staffNavigation } from './navigation'

type PageModule = { default: ComponentType }

/** Every page loads on demand, so the shop does not download the till and the back office. */
const page = (load: () => Promise<PageModule>, anyOf?: PermissionCode[]): Pick<RouteObject, 'lazy'> => ({
  lazy: async () => {
    const { default: Page } = await load()
    return { Component: anyOf ? () => <RequirePermission anyOf={anyOf}><Page /></RequirePermission> : Page }
  },
})

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ShopShell />,
    children: [
      { index: true, ...page(() => import('@/pages/shop-catalog')) },
      { path: 'books/:id', ...page(() => import('@/pages/shop-book')) },
      { path: 'cart', ...page(() => import('@/pages/shop-cart')) },
      { path: 'checkout', ...page(() => import('@/pages/shop-checkout')) },
      { path: 'orders/placed/:code?', ...page(() => import('@/pages/shop-order-placed')) },
      { path: 'track/:code?', ...page(() => import('@/pages/shop-track')) },
      { path: 'bonuses', ...page(() => import('@/pages/shop-bonuses')) },
    ],
  },
  { path: '/staff/login', ...page(() => import('@/pages/staff-login')) },
  {
    path: '/staff',
    element: <RequireSession />,
    children: [
      { path: 'till', ...page(() => import('@/pages/till'), [Perm.SalesCreate]) },
      {
        element: <StaffShell navigation={staffNavigation} />,
        children: [
          { index: true, ...page(() => import('@/pages/staff-home')) },
          { path: 'returns', ...page(() => import('@/pages/returns'), [Perm.ReturnsCreate, Perm.ReturnsConfirm]) },
          { path: 'orders', ...page(() => import('@/pages/order-board'), [Perm.OrdersManage]) },
          { path: 'orders/:id', ...page(() => import('@/pages/order'), [Perm.OrdersManage]) },
          { path: 'customers', ...page(() => import('@/pages/customers'), [Perm.CrmManage, Perm.SalesCreate]) },
          { path: 'customers/:id', ...page(() => import('@/pages/customer'), [Perm.CrmManage, Perm.SalesCreate]) },
          { path: 'stock', ...page(() => import('@/pages/stock'), [Perm.StockAdjust, Perm.WriteOffCreate, Perm.SalesCreate]) },
          { path: 'transfers', ...page(() => import('@/pages/transfers'), [Perm.TransfersManage]) },
          { path: 'transfers/new', ...page(() => import('@/pages/transfer-new'), [Perm.TransfersManage]) },
          { path: 'transfers/:id', ...page(() => import('@/pages/transfer'), [Perm.TransfersManage]) },
          { path: 'counts', ...page(() => import('@/pages/counts'), [Perm.InventoryCountManage, Perm.InventoryCountApprove]) },
          { path: 'counts/:id', ...page(() => import('@/pages/count-sheet'), [Perm.InventoryCountManage, Perm.InventoryCountApprove]) },
          { path: 'receiving', ...page(() => import('@/pages/receiving'), [Perm.ReceivingConfirm]) },
          { path: 'receiving/:id', ...page(() => import('@/pages/goods-receipt'), [Perm.ReceivingConfirm, Perm.PurchasingManage]) },
          { path: 'purchase-orders', ...page(() => import('@/pages/purchase-orders'), [Perm.PurchasingManage, Perm.ReceivingConfirm]) },
          { path: 'purchase-orders/new', ...page(() => import('@/pages/purchase-order-new'), [Perm.PurchasingManage]) },
          { path: 'purchase-orders/:id', ...page(() => import('@/pages/purchase-order'), [Perm.PurchasingManage, Perm.ReceivingConfirm]) },
          { path: 'suppliers', ...page(() => import('@/pages/suppliers'), [Perm.PurchasingManage]) },
          { path: 'catalog', ...page(() => import('@/pages/catalog-admin'), [Perm.CatalogEdit, Perm.PriceChange]) },
          { path: 'catalog/references', ...page(() => import('@/pages/references'), [Perm.CatalogEdit]) },
          { path: 'catalog/new', ...page(() => import('@/pages/book-form'), [Perm.CatalogEdit]) },
          { path: 'catalog/:id', ...page(() => import('@/pages/book-form'), [Perm.CatalogEdit, Perm.PriceChange]) },
          { path: 'promotions', ...page(() => import('@/pages/promotions'), [Perm.PromotionsManage]) },
          { path: 'segments', ...page(() => import('@/pages/segments'), [Perm.CrmManage]) },
          { path: 'reports', ...page(() => import('@/pages/reports'), [Perm.ReportsView]) },
          { path: 'admin/users', ...page(() => import('@/pages/users'), [Perm.UsersManage]) },
          { path: 'admin/roles', ...page(() => import('@/pages/roles'), [Perm.UsersManage]) },
          { path: 'admin/locations', ...page(() => import('@/pages/locations'), [Perm.LocationsManage]) },
          { path: 'admin/integrations', ...page(() => import('@/pages/integrations'), [Perm.IntegrationsManage]) },
          { path: 'admin/audit', ...page(() => import('@/pages/audit'), [Perm.AuditView]) },
          { path: '*', ...page(() => import('@/pages/not-found')) },
        ],
      },
    ],
  },
  { path: '*', ...page(() => import('@/pages/not-found')) },
]

export const browserRouter = createBrowserRouter(routes)
