import { Group, Table, Text } from '@mantine/core'
import { integrationKindLabel } from '@/entities/reference'
import type { Integration } from '@/entities/reference'
import { IntegrationEnabledSwitch } from '@/features/admin-integrations'
import { StatusBadge } from '@/shared/ui'

export function IntegrationsTable({ integrations }: { integrations: Integration[] }) {
  const sorted = [...integrations].sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name, 'uk'))
  return (
    <Table.ScrollContainer minWidth={560}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Підключення</Table.Th>
            <Table.Th>Тип</Table.Th>
            <Table.Th>Стан</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>Увімкнено</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sorted.map((integration) => (
            <Table.Tr key={integration.id}>
              <Table.Td><Text fw={600}>{integration.name}</Text></Table.Td>
              <Table.Td>{integrationKindLabel[integration.kind]}</Table.Td>
              <Table.Td>
                {integration.enabled ? <StatusBadge tone="ready" label="Працює" /> : <StatusBadge tone="draft" label="Вимкнено" />}
              </Table.Td>
              <Table.Td>
                <Group justify="flex-end"><IntegrationEnabledSwitch integration={integration} /></Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
