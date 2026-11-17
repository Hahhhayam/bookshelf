import { Alert, Stack } from '@mantine/core'
import { useLocationNames, useReferenceList } from '@/entities/reference'
import type { Viewer } from '@/entities/viewer'
import { ExportCsvButton } from '@/features/reports-export'
import { PageHeader } from '@/shared/ui'
import type { Drill } from '../model/drill'
import { useFigures } from '../model/figures'
import { useReportFilter } from '../model/useReportFilter'
import { FigurePicker } from './FigurePicker'
import { ReportDashboard } from './ReportDashboard'
import { ReportFilters } from './ReportFilters'

export function ReportsScreen({ viewer, chainWide }: { viewer: Viewer; chainWide: boolean }) {
  const own = viewer.locations.map((location) => location.id)
  const state = useReportFilter(own, chainWide)
  const figures = useFigures()
  const locations = useReferenceList('locations')
  const locationName = useLocationNames()
  const categories = useReferenceList('categories')

  const storeOptions = (chainWide ? locations.data ?? [] : viewer.locations).map((l) => ({ value: l.id, label: l.name }))
  const categoryOptions = (categories.data ?? []).map((c) => ({ value: c.id, label: c.name }))
  const wholeChain = state.filter?.locations.length === 0
  const drill: Drill = {
    location: (id) => state.setLocations([id]),
    category: state.setCategory,
    book: state.setBook,
  }

  return (
    <Stack gap="lg">
      <PageHeader
        eyebrow="Звіти" title={wholeChain ? 'Продажі мережі' : 'Продажі'}
        actions={state.filter && <ExportCsvButton filter={state.filter} />}
      />
      <ReportFilters state={state} storeOptions={storeOptions} categoryOptions={categoryOptions} chainWide={chainWide} />
      <FigurePicker state={figures} />
      {state.filter
        ? <ReportDashboard filter={state.filter} locationName={locationName} shown={figures.shown} drill={drill} />
        : <Alert color="yellow" variant="light">Початок періоду має бути не пізніше за його кінець.</Alert>}
    </Stack>
  )
}
