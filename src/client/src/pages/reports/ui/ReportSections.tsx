import { SimpleGrid, Stack } from '@mantine/core'
import { useBookTitles } from '@/entities/book'
import { referenceName } from '@/entities/reference'
import type { ManagementReport } from '@/entities/report'
import { formatMoney } from '@/shared/lib'
import { abcSample, listLimit, shownBookIds } from '../model/sections'
import { AbcTable } from './AbcTable'
import { ReportTiles } from './ReportTiles'
import { RevenueBars } from './RevenueBars'
import { ShortagesTable } from './ShortagesTable'
import { SlowMovingTable } from './SlowMovingTable'
import { TopBooksTable } from './TopBooksTable'

/** Turns the report's ids into names and feeds every section plain rows. */
export function ReportSections({ report, locationName }: { report: ManagementReport; locationName: (id: string) => string }) {
  const title = useBookTitles(shownBookIds(report))
  const currency = report.revenue.currency
  const money = (amount: number) => formatMoney({ amount, currency })
  const total = report.revenue.amount
  const abc = abcSample(report)

  return (
    <Stack gap="lg">
      <ReportTiles
        revenue={report.revenue} margin={report.margin} receipts={report.receipts}
        averageCheck={report.averageCheck} daysOfStock={report.daysOfStock}
      />
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <RevenueBars
          title="Виручка за магазинами" format={money}
          rows={report.stores.map((s) => ({ key: s.location, label: locationName(s.location), value: s.revenue.amount }))}
        />
        <RevenueBars
          title="Виручка за категоріями" format={money}
          rows={report.categories.map((c) => ({
            key: c.category ?? 'none', label: c.category ? referenceName('categories', c.category) : 'Без категорії', value: c.revenue.amount,
          }))}
        />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <TopBooksTable rows={report.topBooks.map((b) => ({ ...b, title: title(b.book) }))} />
        <AbcTable
          counts={abc.counts}
          rows={abc.sample.map((a) => ({
            book: a.book, title: title(a.book), cls: a.class, cumulative: a.cumulativeShare,
            share: total > 0 ? a.revenue.amount / total : 0,
          }))}
        />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <ShortagesTable
          more={Math.max(0, report.shortages.length - listLimit)}
          rows={report.shortages.slice(0, listLimit).map((s) => ({
            key: `${s.location}:${s.book}`, title: title(s.book), location: locationName(s.location), onHand: s.onHand, minimum: s.minimum,
          }))}
        />
        <SlowMovingTable
          more={Math.max(0, report.slowMovingBooks.length - listLimit)}
          rows={report.slowMovingBooks.slice(0, listLimit).map((book) => ({ book, title: title(book) }))}
        />
      </SimpleGrid>
    </Stack>
  )
}
