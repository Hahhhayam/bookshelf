import { Select } from '@mantine/core'
import { useReferenceList } from '../model/queries'

/** Picks an active location of the chain. */
export function LocationSelect({ label, value, onChange, exclude, error }: {
  label: string
  value: string | null
  onChange: (id: string | null) => void
  exclude?: string
  error?: string
}) {
  const locations = useReferenceList('locations', { active: true })
  const options = (locations.data ?? []).filter((location) => location.id !== exclude)
  return (
    <Select
      label={label}
      placeholder={locations.isLoading ? 'Завантаження…' : 'Оберіть локацію'}
      data={options.map((location) => ({ value: location.id, label: location.name }))}
      value={value}
      onChange={onChange}
      searchable
      nothingFoundMessage="Нічого не знайдено"
      error={error ?? (locations.isError ? 'Не вдалося завантажити локації' : undefined)}
    />
  )
}
