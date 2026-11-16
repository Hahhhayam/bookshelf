import { Alert, Stack } from '@mantine/core'
import { useKnownLocations, useReferenceList } from '@/entities/reference'
import type { Viewer } from '@/entities/viewer'
import { ExportCsvButton } from '@/features/reports-export'
import { PageHeader } from '@/shared/ui'
import { useReportFilter } from '../model/useReportFilter'
import { ReportDashboard } from './ReportDashboard'
import { ReportFilters } from './ReportFilters'

export function ReportsScreen({ viewer, chainWide }: { viewer: Viewer; chainWide: boolean }) {
  const own = viewer.locations.map((location) => location.id)
  const state = useReportFilter(own, chainWide)
  const locations = useKnownLocations(viewer.locations)
  const categories = useReferenceList('categories')

  const storeOptions = (chainWide ? locations.list : locations.list.filter((l) => l.own))
    .map((l) => ({ value: l.id, label: l.name }))
  const categoryOptions = (categories.data ?? []).map((c) => ({ value: c.id, label: c.name }))
  const wholeChain = state.filter?.locations.length === 0

  return (
    <Stack gap="lg">
      <PageHeader
        eyebrow="Звіти" title={wholeChain ? 'Продажі мережі' : 'Продажі'}
        actions={state.filter && <ExportCsvButton filter={state.filter} />}
      />
      <ReportFilters state={state} storeOptions={storeOptions} categoryOptions={categoryOptions} chainWide={chainWide} />
      {state.filter
        ? <ReportDashboard filter={state.filter} locationName={locations.nameOf} />
        : <Alert color="yellow" variant="light">Початок періоду має бути не пізніше за його кінець.</Alert>}
    </Stack>
  )
}
