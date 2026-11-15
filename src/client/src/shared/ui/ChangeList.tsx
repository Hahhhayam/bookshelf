import { Group, Stack, Text } from '@mantine/core'
import { tokens } from '@/shared/config/tokens'

export interface ChangeSection {
  title: string
  added: string[]
  removed: string[]
}

function Chips({ items, sign, color }: { items: string[]; sign: string; color: string }) {
  return (
    <Group gap={6}>
      {items.map((item) => (
        <span key={item} style={{ fontSize: 13, fontWeight: 600, padding: '2px 8px', color, background: tokens.color.sunk }}>
          {sign} {item}
        </span>
      ))}
    </Group>
  )
}

/** What a rights change adds and removes, shown before it is confirmed. */
export function ChangeList({ sections }: { sections: ChangeSection[] }) {
  const changed = sections.filter((section) => section.added.length + section.removed.length > 0)
  if (changed.length === 0) return <Text c="dimmed">Змін немає.</Text>
  return (
    <Stack gap="md">
      {changed.map((section) => (
        <Stack key={section.title} gap={6}>
          <Text size="sm" fw={600}>{section.title}</Text>
          {section.added.length > 0 && <Chips items={section.added} sign="+" color={tokens.color.positive} />}
          {section.removed.length > 0 && <Chips items={section.removed} sign="−" color={tokens.color.danger} />}
        </Stack>
      ))}
    </Stack>
  )
}
