import { Group, Text } from '@mantine/core'
import { permissionCount, permissionGroups } from '@/shared/lib'
import { PermissionGroupBlock } from './PermissionGroupBlock'

/** The permission checklist grouped by area of work (FormDialogs artboard, role editor). */
export function PermissionChecklist({ selected, onChange }: {
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const known = permissionGroups.flatMap((group) => group.items.map((item) => item.code as string))
  const chosen = selected.filter((code) => known.includes(code)).length
  const toggle = (codes: string[], on: boolean) =>
    onChange(on ? [...new Set([...selected, ...codes])] : selected.filter((code) => !codes.includes(code)))

  return (
    <div>
      <Group justify="space-between" px="md" py="sm">
        <Text fw={600}>Права за розділами</Text>
        <Text size="sm" c="dimmed">Вибрано {chosen} з {permissionCount}</Text>
      </Group>
      {permissionGroups.map((group) => (
        <PermissionGroupBlock
          key={group.title} group={group} selected={selected}
          onToggle={(code, on) => toggle([code], on)}
          onToggleAll={(on) => toggle(group.items.map((item) => item.code), on)}
        />
      ))}
    </div>
  )
}
