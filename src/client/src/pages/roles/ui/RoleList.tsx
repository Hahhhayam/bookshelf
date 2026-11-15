import { NavLink, Text } from '@mantine/core'
import type { Role } from '@/entities/reference'
import { permissionCount } from '@/shared/lib'
import { Panel } from '@/shared/ui'

export function RoleList({ roles, selected, onSelect }: {
  roles: Role[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <Panel title="Ролі">
      {roles.map((role) => (
        <NavLink
          key={role.id} component="button" active={role.id === selected} onClick={() => onSelect(role.id)}
          label={<Text fw={600} size="sm">{role.name}</Text>}
          description={`${role.permissions.length} з ${permissionCount} прав`}
        />
      ))}
    </Panel>
  )
}
