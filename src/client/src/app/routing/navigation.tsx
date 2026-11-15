import {
  IconArrowsExchange, IconBuildingStore, IconCash, IconChartBar, IconClipboardCheck, IconClipboardList, IconHistory,
  IconHome, IconPackageImport, IconPlugConnected, IconReceiptRefund, IconShieldLock, IconShoppingBag, IconSpeakerphone,
  IconTruckDelivery, IconUsers, IconUsersGroup, IconBooks, IconBuildingWarehouse, IconTags, IconAddressBook,
} from '@tabler/icons-react'
import { Perm } from '@/shared/lib'
import type { NavGroup } from '@/widgets/staff-shell'

const icon = (Icon: typeof IconHome) => <Icon size={20} stroke={1.75} />

/** The staff menu; each item shows only to users holding one of its permissions (UI_Design.md, section 6.1). */
export const staffNavigation: NavGroup[] = [
  {
    title: null,
    items: [{ label: 'Головна', to: '/staff', icon: icon(IconHome), end: true }],
  },
  {
    title: 'Магазин',
    items: [
      { label: 'Каса', to: '/staff/till', icon: icon(IconCash), anyOf: [Perm.SalesCreate] },
      { label: 'Повернення', to: '/staff/returns', icon: icon(IconReceiptRefund), anyOf: [Perm.ReturnsCreate, Perm.ReturnsConfirm] },
      { label: 'Замовлення', to: '/staff/orders', icon: icon(IconShoppingBag), anyOf: [Perm.OrdersManage] },
      { label: 'Клієнти', to: '/staff/customers', icon: icon(IconAddressBook), anyOf: [Perm.CrmManage, Perm.SalesCreate] },
    ],
  },
  {
    title: 'Склад',
    items: [
      { label: 'Залишки', to: '/staff/stock', icon: icon(IconBuildingWarehouse), anyOf: [Perm.StockAdjust, Perm.WriteOffCreate, Perm.SalesCreate] },
      { label: 'Переміщення', to: '/staff/transfers', icon: icon(IconArrowsExchange), anyOf: [Perm.TransfersManage] },
      { label: 'Інвентаризація', to: '/staff/counts', icon: icon(IconClipboardCheck), anyOf: [Perm.InventoryCountManage, Perm.InventoryCountApprove] },
      { label: 'Приймання', to: '/staff/receiving', icon: icon(IconPackageImport), anyOf: [Perm.ReceivingConfirm] },
    ],
  },
  {
    title: 'Закупівлі',
    items: [
      { label: 'Замовлення постачальникам', to: '/staff/purchase-orders', icon: icon(IconClipboardList), anyOf: [Perm.PurchasingManage, Perm.ReceivingConfirm] },
      { label: 'Постачальники', to: '/staff/suppliers', icon: icon(IconTruckDelivery), anyOf: [Perm.PurchasingManage] },
    ],
  },
  {
    title: 'Каталог і маркетинг',
    items: [
      { label: 'Каталог', to: '/staff/catalog', icon: icon(IconBooks), anyOf: [Perm.CatalogEdit, Perm.PriceChange] },
      { label: 'Довідники', to: '/staff/catalog/references', icon: icon(IconTags), anyOf: [Perm.CatalogEdit] },
      { label: 'Акції', to: '/staff/promotions', icon: icon(IconSpeakerphone), anyOf: [Perm.PromotionsManage] },
      { label: 'Сегменти', to: '/staff/segments', icon: icon(IconUsersGroup), anyOf: [Perm.CrmManage] },
    ],
  },
  {
    title: 'Аналітика',
    items: [{ label: 'Звіти', to: '/staff/reports', icon: icon(IconChartBar), anyOf: [Perm.ReportsView] }],
  },
  {
    title: 'Адміністрування',
    items: [
      { label: 'Користувачі', to: '/staff/admin/users', icon: icon(IconUsers), anyOf: [Perm.UsersManage] },
      { label: 'Ролі', to: '/staff/admin/roles', icon: icon(IconShieldLock), anyOf: [Perm.UsersManage] },
      { label: 'Локації', to: '/staff/admin/locations', icon: icon(IconBuildingStore), anyOf: [Perm.LocationsManage] },
      { label: 'Інтеграції', to: '/staff/admin/integrations', icon: icon(IconPlugConnected), anyOf: [Perm.IntegrationsManage] },
      { label: 'Журнал аудиту', to: '/staff/admin/audit', icon: icon(IconHistory), anyOf: [Perm.AuditView] },
    ],
  },
]
