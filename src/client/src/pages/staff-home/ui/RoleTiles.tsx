import { SimpleGrid } from '@mantine/core'
import {
  IconAddressBook, IconBook2, IconBoxSeam, IconChartBar, IconClipboardList, IconTruckDelivery, IconTransfer,
  IconTruckLoading, IconUsers, type Icon,
} from '@tabler/icons-react'
import { useCan } from '@/entities/viewer'
import { Perm, type PermissionCode } from '@/shared/lib'
import { EmptyState } from '@/shared/ui'
import { HomeTile } from './HomeTile'

interface Area {
  perm: PermissionCode
  to: string
  icon: Icon
  title: string
  text: string
}

/** The areas a non-cashier can open; a new area is a new row. */
const areas: Area[] = [
  { perm: Perm.OrdersManage, to: '/staff/orders', icon: IconClipboardList, title: 'Онлайн-замовлення', text: 'Дошка замовлень магазину' },
  { perm: Perm.TransfersManage, to: '/staff/transfers', icon: IconTransfer, title: 'Переміщення', text: 'Між складом і магазинами' },
  { perm: Perm.PurchasingManage, to: '/staff/purchase-orders', icon: IconTruckDelivery, title: 'Закупівлі', text: 'Замовлення постачальникам' },
  { perm: Perm.ReceivingConfirm, to: '/staff/receiving', icon: IconTruckLoading, title: 'Приймання', text: 'Очікувані поставки' },
  { perm: Perm.CatalogEdit, to: '/staff/catalog', icon: IconBook2, title: 'Каталог', text: 'Книги, довідники, ціни' },
  { perm: Perm.ReportsView, to: '/staff/reports', icon: IconChartBar, title: 'Звіти', text: 'Продажі й залишки' },
  { perm: Perm.UsersManage, to: '/staff/admin/users', icon: IconUsers, title: 'Користувачі', text: 'Облікові записи й ролі' },
  { perm: Perm.CrmManage, to: '/staff/customers', icon: IconAddressBook, title: 'Клієнти', text: 'Картки лояльності, сегменти' },
  { perm: Perm.StockAdjust, to: '/staff/stock', icon: IconBoxSeam, title: 'Залишки', text: 'Коригування й списання' },
]

export function RoleTiles() {
  const can = useCan()
  const open = areas.filter((area) => can(area.perm))
  if (open.length === 0) {
    return <EmptyState title="Поки немає доступних розділів" text="Розділи з’являться, коли адміністратор додасть вам права." />
  }
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {open.map(({ perm, to, icon: AreaIcon, title, text }, i) => (
        <HomeTile key={perm} to={to} primary={i === 0} icon={<AreaIcon size={32} stroke={1.75} />} title={title} text={text} />
      ))}
    </SimpleGrid>
  )
}
