import { SimpleGrid, Stack } from '@mantine/core'
import type { ManagementReport } from '@/entities/report'
import { formatMoney, formatNumber } from '@/shared/lib'
import { MoneyText, StatTile } from '@/shared/ui'
import type { Figure } from '../model/figures'
import { Trend } from './Trend'

const percent = new Intl.NumberFormat('uk-UA', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** The headline figures of the period the manager chose, each with its trend against the previous period. */
export function ReportTiles({ report, shown }: { report: ManagementReport; shown: (figure: Figure) => boolean }) {
  const { revenue, margin, receipts, averageCheck, daysOfStock, previousPeriod: previous } = report
  const marginShare = revenue.amount > 0 ? percent.format(margin.amount / revenue.amount) : '—'
  const tiles = [
    shown('revenue') && (
      <StatTile key="revenue" label="Виручка" value={<MoneyText value={revenue} />}
        hint={<Trend current={revenue.amount} previous={previous.revenue.amount} previousText={formatMoney(previous.revenue)} />} />
    ),
    shown('margin') && (
      <StatTile key="margin" label="Маржа" value={marginShare} hint={(
        <Stack gap={2}>
          <MoneyText value={margin} />
          <Trend current={margin.amount} previous={previous.margin.amount} previousText={formatMoney(previous.margin)} />
        </Stack>
      )} />
    ),
    shown('receipts') && (
      <StatTile key="receipts" label="Чеки" value={formatNumber(receipts)}
        hint={<Trend current={receipts} previous={previous.receipts} previousText={formatNumber(previous.receipts)} />} />
    ),
    shown('averageCheck') && (
      <StatTile key="averageCheck" label="Середній чек" value={<MoneyText value={averageCheck} />}
        hint={<Trend current={averageCheck.amount} previous={previous.averageCheck.amount} previousText={formatMoney(previous.averageCheck)} />} />
    ),
    shown('daysOfStock') && (
      <StatTile
        key="daysOfStock" label="Днів запасу" value={daysOfStock === null ? '—' : formatNumber(Math.round(daysOfStock))}
        hint={daysOfStock === null ? 'немає продажів за період' : 'за темпом продажів періоду'}
      />
    ),
  ].filter(Boolean)
  if (tiles.length === 0) return null
  return <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: Math.min(tiles.length, 5) }} spacing="md">{tiles}</SimpleGrid>
}
