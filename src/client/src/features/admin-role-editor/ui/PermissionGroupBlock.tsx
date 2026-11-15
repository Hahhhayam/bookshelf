import { Checkbox, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import type { PermissionGroup } from '@/shared/lib'
import { tokens } from '@/shared/config/tokens'

/** One area of work: a checkbox for the whole group (mixed when partly chosen) and one per permission. */
export function PermissionGroupBlock({ group, selected, onToggle, onToggleAll }: {
  group: PermissionGroup
  selected: readonly string[]
  onToggle: (code: string, on: boolean) => void
  onToggleAll: (on: boolean) => void
}) {
  const on = group.items.filter((item) => selected.includes(item.code)).length
  const all = on === group.items.length
  return (
    <Stack gap="sm" p="md" style={{ borderTop: `1px solid ${tokens.color.line}` }}>
      <Group gap="sm">
        <Checkbox
          checked={all} indeterminate={on > 0 && !all} onChange={() => onToggleAll(!all)}
          label={<Text fw={600}>{group.title}</Text>}
        />
        <Text size="sm" c="dimmed">{on} з {group.items.length}</Text>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm" pl={{ base: 0, sm: 30 }}>
        {group.items.map((item) => (
          <Checkbox
            key={item.code} checked={selected.includes(item.code)}
            onChange={(e) => onToggle(item.code, e.currentTarget.checked)}
            label={item.label}
            description={item.warning}
          />
        ))}
      </SimpleGrid>
    </Stack>
  )
}
