import { Stack, TextInput } from '@mantine/core'
import { IconSearch, IconUsers } from '@tabler/icons-react'
import { useState } from 'react'
import { useReferenceList } from '@/entities/reference'
import { CreateUserButton, type AccessOptions } from '@/features/admin-users'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { UsersTable } from './ui/UsersTable'

/** Users: create, change roles and locations, block and unblock (UI_Design 6.9, FR-19). */
export default function UsersPage() {
  const users = useReferenceList('users')
  const roles = useReferenceList('roles')
  const locations = useReferenceList('locations')
  const [search, setSearch] = useState('')

  const options: AccessOptions = {
    roles: (roles.data ?? []).map((role) => ({ value: role.id, label: role.name })),
    locations: (locations.data ?? []).map((location) => ({ value: location.id, label: location.name })),
  }
  const term = search.trim().toLowerCase()

  return (
    <Stack gap="lg">
      <PageHeader eyebrow="Адміністрування" title="Користувачі" actions={<CreateUserButton options={options} />} />
      <TextInput
        aria-label="Пошук користувача" placeholder="Логін" leftSection={<IconSearch size={16} stroke={1.75} />}
        value={search} onChange={(e) => setSearch(e.currentTarget.value)} maw={320}
      />
      <Panel>
        <QueryView
          query={users} isEmpty={(list) => list.length === 0}
          empty={<EmptyState icon={<IconUsers size={32} stroke={1.5} />} title="Користувачів ще немає" text="Створіть першого користувача." />}
        >
          {(list) => {
            const shown = list.filter((user) => user.name.toLowerCase().includes(term))
            return shown.length
              ? <UsersTable users={shown} options={options} />
              : <EmptyState title="Нічого не знайдено" text={`Немає користувача з логіном «${search.trim()}».`} />
          }}
        </QueryView>
      </Panel>
    </Stack>
  )
}
