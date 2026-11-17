import { Group, Table, Text } from '@mantine/core'
import { locationTypeLabel, type Location } from '@/entities/reference'
import { LocationActiveButton, LocationFormButton } from '@/features/admin-locations'
import { StatusBadge } from '@/shared/ui'

export function LocationsTable({ locations }: { locations: Location[] }) {
  return (
    <Table.ScrollContainer minWidth={720}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Назва</Table.Th>
            <Table.Th>Тип</Table.Th>
            <Table.Th>Адреса</Table.Th>
            <Table.Th>Стан</Table.Th>
            <Table.Th aria-label="Дії" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {locations.map((location) => (
            <Table.Tr key={location.id}>
              <Table.Td>
                <Text fw={600}>{location.name}</Text>
              </Table.Td>
              <Table.Td>{locationTypeLabel[location.type]}</Table.Td>
              <Table.Td>{location.address}</Table.Td>
              <Table.Td>
                {location.active ? <StatusBadge tone="ready" label="Активна" /> : <StatusBadge tone="draft" label="Неактивна" />}
              </Table.Td>
              <Table.Td>
                <Group gap={4} justify="flex-end" wrap="nowrap">
                  <LocationFormButton location={location} />
                  <LocationActiveButton location={location} />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
