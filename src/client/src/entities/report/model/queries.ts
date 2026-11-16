import { useQuery } from '@tanstack/react-query'
import { reportApi } from '../api/reportApi'
import type { ReportFilter } from './types'

export const reportKeys = {
  management: (filter: ReportFilter) => ['reports', 'management', filter] as const,
}

/** `enabled` holds the request until the filter is final: an empty `locations` asks for the whole chain. */
export function useManagementReport(filter: ReportFilter, enabled = true) {
  return useQuery({ queryKey: reportKeys.management(filter), queryFn: () => reportApi.management(filter), enabled })
}
