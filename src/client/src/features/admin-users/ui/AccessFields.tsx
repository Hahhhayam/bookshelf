import { MultiSelect } from '@mantine/core'
import type { AccessOptions } from '../model/AccessOptions'

/** Roles and locations of a user; both are replaced as a whole when saved (FR-19). */
export function AccessFields({ options, roles, locations, onRoles, onLocations, error }: {
  options: AccessOptions
  roles: string[]
  locations: string[]
  onRoles: (value: string[]) => void
  onLocations: (value: string[]) => void
  error?: string | null
}) {
  return (
    <>
      <MultiSelect
        label="Ролі" placeholder={roles.length ? undefined : 'Оберіть ролі'} data={options.roles} value={roles}
        onChange={onRoles} searchable clearable nothingFoundMessage="Ролей не знайдено" error={error}
        description="Список — лише ролі, створені в цьому браузері"
      />
      <MultiSelect
        label="Доступ до локацій" placeholder={locations.length ? undefined : 'Оберіть локації'} data={options.locations}
        value={locations} onChange={onLocations} searchable clearable nothingFoundMessage="Локацій не знайдено"
      />
    </>
  )
}
