import { Group, Select, Text } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'
import { setWorkingLocation, useViewer, useWorkingLocation } from '@/entities/viewer'
import { tokens } from '@/shared/config/tokens'

/** The store or warehouse the user works in; with a single location there is nothing to switch. */
export function LocationSwitcher() {
  const locations = useViewer().data?.locations ?? []
  const current = useWorkingLocation()
  if (!current) return <Text size="sm" c="dimmed">Немає доступних локацій</Text>

  const pin = <IconMapPin size={18} stroke={1.75} color={tokens.color.accent} />
  if (locations.length === 1) {
    return <Group gap={8}>{pin}<Text fw={600} size="md">{current.name}</Text></Group>
  }
  return (
    <Select
      aria-label="Локація"
      leftSection={pin}
      data={locations.map((l) => ({ value: l.id, label: l.name }))}
      value={current.id}
      onChange={(value) => value && setWorkingLocation(value)}
      allowDeselect={false}
      w={280}
    />
  )
}
