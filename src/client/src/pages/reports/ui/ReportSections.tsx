import { SimpleGrid, Stack } from '@mantine/core'
import type { ReactElement } from 'react'
import { useBookTitles } from '@/entities/book'
import { useReferenceNames } from '@/entities/reference'
import type { ManagementReport } from '@/entities/report'
import { formatMoney } from '@/shared/lib'
import type { Drill } from '../model/drill'
import type { Figure } from '../model/figures'
import { abcSample, listLimit, shownBookIds } from '../model/sections'
import { AbcTable } from './AbcTable'
import { ReportTiles } from './ReportTiles'
import { RevenueBars } from './RevenueBars'
import { ShortagesTable } from './ShortagesTable'
import { SlowMovingTable } from './SlowMovingTable'
import { TopBooksTable } from './TopBooksTable'

/** Lays out the chosen sections two by two; an unchosen one leaves no gap. */
function Pair({ sections }: { sections: (false | ReactElement)[] }) {
  const shown = sections.filter(Boolean)
  if (shown.length === 0) return null
  return <SimpleGrid cols={{ base: 1, lg: shown.length }} spacing="lg">{shown}</SimpleGrid>
}

/** Turns the report's ids into names and feeds every chosen section plain rows; names drill down. */
export function ReportSections({ report, locationName, shown, drill }: {
  report: ManagementReport
  locationName: (id: string) => string
  shown: (figure: Figure) => boolean
  drill: Drill
}) {
  const title = useBookTitles(shownBookIds(report))
  const categoryName = useReferenceNames('categories')
  const money = (amount: number) => formatMoney({ amount, currency: report.revenue.currency })
  const total = report.revenue.amount
  const abc = abcSample(report)

  return (
    <Stack gap="lg">
      <ReportTiles report={report} shown={shown} />
      <Pair sections={[
        shown('stores') && (
          <RevenueBars
            key="stores" title="Виручка за магазинами" format={money} onSelect={drill.location}
            rows={report.stores.map((s) => ({ key: s.location, label: locationName(s.location), value: s.revenue.amount }))}
          />
        ),
        shown('categories') && (
          <RevenueBars
            key="categories" title="Виручка за категоріями" format={money}
            onSelect={(key) => { if (key !== 'none') drill.category(key) }}
            rows={report.categories.map((c) => ({
              key: c.category ?? 'none', label: c.category ? categoryName(c.category) : 'Без категорії', value: c.revenue.amount,
            }))}
          />
        ),
      ]} />
      <Pair sections={[
        shown('topBooks') && (
          <TopBooksTable key="top" onBook={drill.book} rows={report.topBooks.map((b) => ({ ...b, title: title(b.book) }))} />
        ),
        shown('abc') && (
          <AbcTable
            key="abc" counts={abc.counts} onBook={drill.book}
            rows={abc.sample.map((a) => ({
              book: a.book, title: title(a.book), cls: a.class, cumulative: a.cumulativeShare,
              share: total > 0 ? a.revenue.amount / total : 0,
            }))}
          />
        ),
      ]} />
      <Pair sections={[
        shown('shortages') && (
          <ShortagesTable
            key="shortages" more={Math.max(0, report.shortages.length - listLimit)} onLocation={drill.location}
            rows={report.shortages.slice(0, listLimit).map((s) => ({
              key: `${s.location}:${s.book}`, title: title(s.book), location: s.location, locationName: locationName(s.location),
              onHand: s.onHand, minimum: s.minimum,
            }))}
          />
        ),
        shown('slowMoving') && (
          <SlowMovingTable
            key="slow" more={Math.max(0, report.slowMovingBooks.length - listLimit)} onBook={drill.book}
            rows={report.slowMovingBooks.slice(0, listLimit).map((book) => ({ book, title: title(book) }))}
          />
        ),
      ]} />
    </Stack>
  )
}
