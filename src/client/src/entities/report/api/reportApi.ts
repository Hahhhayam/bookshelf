import { http } from '@/shared/api'
import type { ManagementReport, ReportFilter } from '../model/types'

const query = (filter: ReportFilter) => ({
  from: filter.from, to: filter.to, locations: filter.locations, category: filter.category, book: filter.book,
})

export const reportApi = {
  management: (filter: ReportFilter) => http.get<ManagementReport>('reports/management', { query: query(filter) }),
  csv: (filter: ReportFilter) => http.blob('reports/management.csv', { query: query(filter) }),
}
