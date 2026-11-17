import { Stack, Text } from '@mantine/core'
import { useManagementReport, type ReportFilter } from '@/entities/report'
import { formatDateTime } from '@/shared/lib'
import { QueryView } from '@/shared/ui'
import type { Drill } from '../model/drill'
import type { Figure } from '../model/figures'
import { ReportSections } from './ReportSections'

export function ReportDashboard({ filter, locationName, shown, drill }: {
  filter: ReportFilter
  locationName: (id: string) => string
  shown: (figure: Figure) => boolean
  drill: Drill
}) {
  const report = useManagementReport(filter)
  return (
    <QueryView query={report} skeletonRows={10}>
      {(data) => (
        <Stack gap="sm">
          <Text size="sm" c="dimmed" aria-live="polite">
            оновлено {formatDateTime(new Date(report.dataUpdatedAt).toISOString())}{report.isFetching ? ' · оновлюємо…' : ''}
          </Text>
          <ReportSections report={data} locationName={locationName} shown={shown} drill={drill} />
        </Stack>
      )}
    </QueryView>
  )
}
