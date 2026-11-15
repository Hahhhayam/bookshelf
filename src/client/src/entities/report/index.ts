import { useQuery } from '@tanstack/react-query'
import { reportApi } from './api/reportApi'
import type { ReportFilter } from './model/types'

export { reportApi }
export type { ManagementReport, ReportFilter } from './model/types'

export function useManagementReport(filter: ReportFilter) {
  return useQuery({ queryKey: ['reports', 'management', filter], queryFn: () => reportApi.management(filter) })
}
