import { Button, Group, Stack, Switch, Table, Text } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import { useState } from 'react'
import { useReferenceList } from '@/entities/reference'
import { CreateNameForm, RenameDialog, useReferenceCommands, type ManagedReferenceKind } from '@/features/catalog-reference-manage'
import { EmptyState, Panel, QueryView } from '@/shared/ui'

interface Row {
  id: string
  name: string
  active?: boolean
}

const copy: Record<ManagedReferenceKind, { add: string; placeholder: string; empty: string }> = {
  authors: { add: 'Новий автор', placeholder: 'Ім’я та прізвище', empty: 'Авторів тут ще не створювали' },
  publishers: { add: 'Нове видавництво', placeholder: 'Назва видавництва', empty: 'Видавництв тут ще не створювали' },
  categories: { add: 'Нова категорія', placeholder: 'Назва категорії', empty: 'Категорій тут ще не створювали' },
}

export function ReferenceList({ kind }: { kind: ManagedReferenceKind }) {
  const list = useReferenceList(kind)
  const commands = useReferenceCommands(kind)
  const [renaming, setRenaming] = useState<Row | null>(null)

  return (
    <Stack gap="md">
      <Panel padding={16}>
        <CreateNameForm label={copy[kind].add} placeholder={copy[kind].placeholder} loading={commands.create.isPending}
          onCreate={(name) => commands.create.mutateAsync(name)} />
      </Panel>
      <Panel>
        <QueryView query={list} isEmpty={(rows) => rows.length === 0}
          empty={<EmptyState title={copy[kind].empty} text="Додайте перший запис формою вище." />}>
          {(rows) => <Rows rows={rows} canToggle={commands.canToggle} onRename={setRenaming}
            onToggle={(id, active) => commands.toggle.mutate({ id, active })} />}
        </QueryView>
      </Panel>
      {renaming && (
        <RenameDialog opened current={renaming.name} loading={commands.rename.isPending}
          error={commands.rename.error ?? undefined}
          onClose={() => { setRenaming(null); commands.rename.reset() }}
          onRename={(name) => commands.rename.mutate({ id: renaming.id, name }, { onSuccess: () => setRenaming(null) })} />
      )}
    </Stack>
  )
}

function Rows({ rows, canToggle, onRename, onToggle }: {
  rows: Row[]
  canToggle: boolean
  onRename: (row: Row) => void
  onToggle: (id: string, active: boolean) => void
}) {
  return (
    <Table.ScrollContainer minWidth={420}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr><Table.Th>Назва</Table.Th>{canToggle && <Table.Th>Активний</Table.Th>}<Table.Th /></Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td><Text fw={500} c={row.active === false ? 'dimmed' : undefined}>{row.name}</Text></Table.Td>
              {canToggle && (
                <Table.Td>
                  <Switch checked={row.active !== false} aria-label={`Активний: ${row.name}`}
                    onChange={(e) => onToggle(row.id, e.currentTarget.checked)} />
                </Table.Td>
              )}
              <Table.Td>
                <Group justify="flex-end">
                  <Button variant="subtle" size="xs" leftSection={<IconPencil size={14} />} onClick={() => onRename(row)}>
                    Перейменувати
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
