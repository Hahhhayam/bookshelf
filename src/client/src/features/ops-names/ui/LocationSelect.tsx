import { Anchor, Select, Stack, TextInput } from '@mantine/core'
import { useState } from 'react'
import { useKnownLocations } from '../model/names'

const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Picks a location from those this browser knows. The API cannot list all locations (GAP-03), so a location never
 * seen here can still be entered by its id.
 */
export function LocationSelect({ label, value, onChange, exclude, error }: {
  label: string
  value: string | null
  onChange: (id: string | null) => void
  exclude?: string
  error?: string
}) {
  const options = useKnownLocations().filter((location) => location.id !== exclude)
  const [manual, setManual] = useState(false)
  const [typed, setTyped] = useState('')

  function onType(text: string) {
    setTyped(text)
    onChange(guid.test(text.trim()) ? text.trim() : null)
  }

  return (
    <Stack gap={4}>
      {manual ? (
        <TextInput
          label={label}
          placeholder="Ідентифікатор локації"
          value={typed}
          onChange={(event) => onType(event.currentTarget.value)}
          error={typed && !value ? 'Невірний формат ідентифікатора' : error}
          styles={{ input: { fontFamily: 'var(--mantine-font-family-monospace)' } }}
        />
      ) : (
        <Select
          label={label}
          placeholder={options.length ? 'Оберіть локацію' : 'Немає відомих локацій'}
          data={options.map((location) => ({ value: location.id, label: location.name }))}
          value={value}
          onChange={onChange}
          searchable
          nothingFoundMessage="Нічого не знайдено"
          error={error}
        />
      )}
      <Anchor component="button" type="button" size="sm" ta="left" onClick={() => { setManual(!manual); onChange(null); setTyped('') }}>
        {manual ? 'Обрати зі списку' : 'Локації немає у списку? Ввести ідентифікатор'}
      </Anchor>
    </Stack>
  )
}
