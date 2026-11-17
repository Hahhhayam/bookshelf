import { Group, Stack, Table, Text } from '@mantine/core'
import { integrationKindLabel, type Integration } from '@/entities/reference'
import { IntegrationEnabledSwitch } from '@/features/admin-integrations'
import { statusTone, tokens } from '@/shared/config/tokens'
import { formatDateTime } from '@/shared/lib'
import { StatusBadge } from '@/shared/ui'

function ConnectionState({ integration }: { integration: Integration }) {
  if (!integration.enabled) return <StatusBadge tone="draft" label="Вимкнено" />
  return integration.status === 'Failed'
    ? <StatusBadge tone="problem" label="Помилка зв’язку" />
    : <StatusBadge tone="ready" label="Працює" />
}

/** The last exchange and the last error, so a critical integration failure (FR-18) is visible here too. */
function ConnectionDetails({ integration }: { integration: Integration }) {
  return (
    <Stack gap={2}>
      <Text size="sm">{integration.lastExchangeAt ? formatDateTime(integration.lastExchangeAt) : '—'}</Text>
      {integration.lastError && (
        <Text size="xs" c={integration.status === 'Failed' ? tokens.color.danger : tokens.color.ink3} lineClamp={2}>
          {formatDateTime(integration.lastErrorAt)}: {integration.lastError}
        </Text>
      )}
    </Stack>
  )
}

export function IntegrationsTable({ integrations }: { integrations: Integration[] }) {
  const sorted = [...integrations].sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name, 'uk'))
  return (
    <Table.ScrollContainer minWidth={760}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Підключення</Table.Th>
            <Table.Th>Тип</Table.Th>
            <Table.Th>Стан</Table.Th>
            <Table.Th>Останній обмін / помилка</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>Увімкнено</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sorted.map((integration) => (
            <Table.Tr key={integration.id} style={integration.enabled && integration.status === 'Failed' ? { background: statusTone.problem.row } : undefined}>
              <Table.Td><Text fw={600}>{integration.name}</Text></Table.Td>
              <Table.Td>{integrationKindLabel[integration.kind]}</Table.Td>
              <Table.Td><ConnectionState integration={integration} /></Table.Td>
              <Table.Td><ConnectionDetails integration={integration} /></Table.Td>
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
