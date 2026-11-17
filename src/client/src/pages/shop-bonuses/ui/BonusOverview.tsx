import { Group, Stack, Table, Text } from '@mantine/core'
import { bonusKindLabel, tierLabel, type BonusSummary } from '@/entities/customer'
import { formatDateTime, formatNumber } from '@/shared/lib'
import { Panel, StatTile } from '@/shared/ui'

export function BonusOverview({ bonuses }: { bonuses: BonusSummary }) {
  return (
    <Stack gap="lg">
      <Group grow align="stretch">
        <StatTile label="Бонусний баланс" value={formatNumber(bonuses.balance)} />
        <StatTile label="Рівень програми" value={tierLabel[bonuses.tier]} />
      </Group>
      <Panel title="Історія бонусів">
        {bonuses.operations.length === 0 ? (
          <Text size="sm" c="dimmed" p="md">Операцій ще немає: бонуси нараховуються за покупки з карткою.</Text>
        ) : (
          <Table verticalSpacing="sm">
            <Table.Tbody>
              {bonuses.operations.map((op, i) => (
                <Table.Tr key={i}>
                  <Table.Td><Text size="sm">{formatDateTime(op.at)}</Text></Table.Td>
                  <Table.Td><Text size="sm">{bonusKindLabel[op.kind]}</Text></Table.Td>
                  <Table.Td ta="right"><Text size="sm" fw={600}>{op.points > 0 ? `+${op.points}` : op.points}</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Panel>
    </Stack>
  )
}
