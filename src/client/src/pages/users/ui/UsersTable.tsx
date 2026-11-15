import { Group, Table, Text } from '@mantine/core'
import type { User } from '@/entities/reference'
import { BlockUserButton, ChangeAccessButton, labelOf, type AccessOptions } from '@/features/admin-users'
import { StatusBadge } from '@/shared/ui'

const names = (ids: string[], options: AccessOptions['roles']) =>
  ids.length ? ids.map((id) => labelOf(options, id)).join(', ') : '—'

export function UsersTable({ users, options }: { users: User[]; options: AccessOptions }) {
  return (
    <Table.ScrollContainer minWidth={760}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Логін</Table.Th>
            <Table.Th>Ролі</Table.Th>
            <Table.Th>Локації</Table.Th>
            <Table.Th>Стан</Table.Th>
            <Table.Th aria-label="Дії" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td><Text fw={600}>{user.name}</Text></Table.Td>
              <Table.Td>{names(user.roles, options.roles)}</Table.Td>
              <Table.Td>{names(user.locations, options.locations)}</Table.Td>
              <Table.Td>
                {user.blocked ? <StatusBadge tone="problem" label="Заблокований" /> : <StatusBadge tone="ready" label="Активний" />}
              </Table.Td>
              <Table.Td>
                <Group gap={4} justify="flex-end" wrap="nowrap">
                  <ChangeAccessButton user={user} options={options} />
                  <BlockUserButton user={user} />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
