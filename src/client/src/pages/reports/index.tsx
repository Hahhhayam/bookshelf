import { useCan, useViewer } from '@/entities/viewer'
import { Perm } from '@/shared/lib'
import { QueryView } from '@/shared/ui'
import { ReportsScreen } from './ui/ReportsScreen'

/** Management report dashboard (Reports artboard, UI_Design 6.8, FR-16). */
export default function ReportsPage() {
  const viewer = useViewer()
  const can = useCan()
  // The filter's default stores come from the viewer, so the report waits for it.
  return (
    <QueryView query={viewer}>
      {(data) => <ReportsScreen viewer={data} chainWide={can(Perm.ReportsChainWide)} />}
    </QueryView>
  )
}
