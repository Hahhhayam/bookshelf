import { Perm, type PermissionCode } from './permissions'

export interface PermissionItem {
  code: PermissionCode
  label: string
  /** Why granting it deserves a second thought; shown under the checkbox. */
  warning?: string
}

export interface PermissionGroup {
  title: string
  items: PermissionItem[]
}

/** Every permission code by area of work, in the order the role editor shows them; add a code by adding a row. */
export const permissionGroups: PermissionGroup[] = [
  {
    title: 'Каса й продажі',
    items: [
      { code: Perm.SalesCreate, label: 'Продаж' },
      { code: Perm.SalesDiscount, label: 'Ручна знижка' },
      { code: Perm.SalesCancel, label: 'Анулювання чека' },
    ],
  },
  {
    title: 'Повернення',
    items: [
      { code: Perm.ReturnsCreate, label: 'Оформлення повернення' },
      { code: Perm.ReturnsConfirm, label: 'Підтвердження повернення' },
    ],
  },
  {
    title: 'Замовлення',
    items: [{ code: Perm.OrdersManage, label: 'Обробка онлайн-замовлень' }],
  },
  {
    title: 'Склад',
    items: [
      { code: Perm.StockAdjust, label: 'Коригування залишків' },
      { code: Perm.TransfersManage, label: 'Переміщення між локаціями' },
      { code: Perm.WriteOffCreate, label: 'Списання' },
    ],
  },
  {
    title: 'Інвентаризація',
    items: [
      { code: Perm.InventoryCountManage, label: 'Проведення інвентаризації' },
      { code: Perm.InventoryCountApprove, label: 'Підтвердження розбіжностей' },
    ],
  },
  {
    title: 'Закупівлі й приймання',
    items: [
      { code: Perm.PurchasingManage, label: 'Замовлення постачальникам' },
      { code: Perm.ReceivingConfirm, label: 'Приймання поставок' },
    ],
  },
  {
    title: 'Каталог',
    items: [
      { code: Perm.CatalogEdit, label: 'Редагування каталогу' },
      { code: Perm.PriceChange, label: 'Зміна цін', warning: 'Лише комерційний менеджер' },
    ],
  },
  {
    title: 'Клієнти й акції',
    items: [
      { code: Perm.CrmManage, label: 'Клієнти, картки й бонуси' },
      { code: Perm.PromotionsManage, label: 'Акції' },
    ],
  },
  {
    title: 'Звіти',
    items: [
      { code: Perm.ReportsView, label: 'Перегляд звітів' },
      { code: Perm.ReportsChainWide, label: 'Звіти по всій мережі', warning: 'Видно дані всіх магазинів' },
      { code: Perm.IntegrationsReport, label: 'Звіт інтеграцій' },
    ],
  },
  {
    title: 'Адміністрування',
    items: [
      { code: Perm.UsersManage, label: 'Користувачі й ролі', warning: 'Дає змогу змінювати права, зокрема власні' },
      { code: Perm.LocationsManage, label: 'Локації' },
      { code: Perm.IntegrationsManage, label: 'Інтеграції' },
      { code: Perm.AuditView, label: 'Журнал аудиту' },
    ],
  },
]

export const permissionCount = permissionGroups.reduce((sum, group) => sum + group.items.length, 0)

const labels = new Map<string, string>(permissionGroups.flatMap((group) => group.items.map((item) => [item.code, item.label])))

/** The Ukrainian name of a permission code; an unknown code shows as itself. */
export function permissionLabel(code: string): string {
  return labels.get(code) ?? code
}
