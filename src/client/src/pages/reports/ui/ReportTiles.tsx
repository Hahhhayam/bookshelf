import { SimpleGrid } from '@mantine/core'
import type { Money } from '@/shared/api'
import { formatNumber } from '@/shared/lib'
import { MoneyText, StatTile } from '@/shared/ui'

const percent = new Intl.NumberFormat('uk-UA', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** The five headline figures of the period. */
export function ReportTiles({ revenue, margin, receipts, averageCheck, daysOfStock }: {
  revenue: Money
  margin: Money
  receipts: number
  averageCheck: Money
  daysOfStock: number | null
}) {
  const marginShare = revenue.amount > 0 ? percent.format(margin.amount / revenue.amount) : '—'
  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 5 }} spacing="md">
      <StatTile label="Виручка" value={<MoneyText value={revenue} />} />
      <StatTile label="Маржа" value={marginShare} hint={<MoneyText value={margin} />} />
      <StatTile label="Чеки" value={formatNumber(receipts)} />
      <StatTile label="Середній чек" value={<MoneyText value={averageCheck} />} />
      <StatTile
        label="Днів запасу" value={daysOfStock === null ? '—' : formatNumber(Math.round(daysOfStock))}
        hint={daysOfStock === null ? 'немає продажів за період' : 'за темпом продажів періоду'}
      />
    </SimpleGrid>
  )
}
