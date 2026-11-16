import { Group, MultiSelect, SegmentedControl, Select, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { BookPicker } from '@/entities/book'
import { presets, type Preset } from '../model/period'
import type { ReportFilterState } from '../model/useReportFilter'

interface Option {
  value: string
  label: string
}

/** Period presets, stores, category and book, as on the Reports artboard. */
export function ReportFilters({ state, storeOptions, categoryOptions, chainWide }: {
  state: ReportFilterState
  storeOptions: Option[]
  categoryOptions: Option[]
  chainWide: boolean
}) {
  const invalidCustom = state.preset === 'custom' && state.filter === null
  return (
    <Group gap="sm" align="flex-end" wrap="wrap">
      <SegmentedControl
        aria-label="Період" data={presets} value={state.preset} onChange={(value) => state.setPreset(value as Preset)}
      />
      {state.preset === 'custom' && (
        <Group gap="xs" align="flex-start">
          <TextInput
            type="date" aria-label="Від" value={state.custom.from} w={160}
            onChange={(e) => state.setCustom({ ...state.custom, from: e.currentTarget.value })}
            error={invalidCustom ? 'Перевірте дати' : undefined}
          />
          <TextInput
            type="date" aria-label="До" value={state.custom.to} w={160}
            onChange={(e) => state.setCustom({ ...state.custom, to: e.currentTarget.value })}
          />
        </Group>
      )}
      <MultiSelect
        aria-label="Магазини" data={storeOptions} value={state.locations} onChange={state.setLocations}
        placeholder={state.locations.length ? undefined : chainWide ? 'Магазини: усі' : 'Магазини: мої'}
        clearable searchable w={{ base: '100%', sm: 280 }} nothingFoundMessage="Немає таких локацій"
      />
      <Select
        aria-label="Категорія" data={categoryOptions} value={state.category} onChange={state.setCategory}
        placeholder="Категорія: усі" clearable searchable w={{ base: '100%', sm: 200 }}
        nothingFoundMessage="Категорії з’являються тут, коли їх створюють у цьому браузері"
      />
      <BookPicker
        aria-label="Фільтр за книгою" placeholder="Книга або ISBN" leftSection={<IconSearch size={16} stroke={1.75} />}
        value={state.book} onChange={state.setBook} w={{ base: '100%', sm: 240 }}
      />
    </Group>
  )
}
