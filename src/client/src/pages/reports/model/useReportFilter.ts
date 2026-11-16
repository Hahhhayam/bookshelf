import { useMemo, useState } from 'react'
import type { ReportFilter } from '@/entities/report'
import { toInputDate } from '@/shared/lib'
import { monthStart, periodOf, type Preset } from './period'

/**
 * The dashboard's filters. No stores means the whole chain, which needs `reports.chain`; without it an empty choice
 * falls back to the user's own locations, as the server would refuse it.
 */
export function useReportFilter(ownLocations: string[], chainWide: boolean) {
  const [preset, setPreset] = useState<Preset>('month')
  const [custom, setCustom] = useState(() => ({ from: monthStart(), to: toInputDate(new Date()) }))
  const [locations, setLocations] = useState<string[]>(chainWide ? [] : ownLocations)
  const [category, setCategory] = useState<string | null>(null)
  const [book, setBook] = useState<string | null>(null)

  const ownKey = ownLocations.join(',')
  const filter = useMemo<ReportFilter | null>(() => {
    const period = periodOf(preset, custom)
    if (!period) return null
    return {
      from: period.from.toISOString(),
      to: period.to.toISOString(),
      locations: locations.length > 0 || chainWide ? locations : ownKey.split(',').filter(Boolean),
      category: category ?? undefined,
      book: book ?? undefined,
    }
  }, [preset, custom, locations, chainWide, ownKey, category, book])

  return {
    filter, preset, setPreset, custom, setCustom, locations, setLocations, category, setCategory, book, setBook,
  }
}

export type ReportFilterState = ReturnType<typeof useReportFilter>
