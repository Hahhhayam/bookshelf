import { Button, Grid, Stack } from '@mantine/core'
import { IconPlus, IconShieldLock } from '@tabler/icons-react'
import { useState } from 'react'
import { useReferenceList } from '@/entities/reference'
import { RoleEditor } from '@/features/admin-role-editor'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { RoleList } from './ui/RoleList'

type Selection = { kind: 'none' } | { kind: 'new' } | { kind: 'role'; id: string }

/** Roles: name and permission checklist grouped by area (FormDialogs artboard, role editor; UI_Design 6.9). */
export default function RolesPage() {
  const roles = useReferenceList('roles')
  const [selection, setSelection] = useState<Selection>({ kind: 'none' })
  const current = selection.kind === 'role' ? roles.data?.find((role) => role.id === selection.id) : undefined
  const startNew = () => setSelection({ kind: 'new' })

  return (
    <Stack gap="lg">
      <PageHeader
        eyebrow="Адміністрування / Ролі" title={selection.kind === 'new' ? 'Нова роль' : current?.name ?? 'Ролі'}
        actions={<Button leftSection={<IconPlus size={18} stroke={1.75} />} onClick={startNew}>Нова роль</Button>}
      />
      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
          <QueryView
            query={roles} isEmpty={(list) => list.length === 0}
            empty={<Panel><EmptyState icon={<IconShieldLock size={32} stroke={1.5} />} title="Ролей ще немає" text="Створіть роль і позначте її права." /></Panel>}
          >
            {(list) => (
              <RoleList roles={list} selected={current?.id ?? null} onSelect={(id) => setSelection({ kind: 'role', id })} />
            )}
          </QueryView>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
          {selection.kind === 'none' || (selection.kind === 'role' && !current)
            ? (
              <Panel>
                <EmptyState
                  title="Оберіть роль" text="Виберіть роль ліворуч, щоб змінити її права, або створіть нову."
                  actions={<Button variant="default" onClick={startNew}>Нова роль</Button>}
                />
              </Panel>
            )
            : (
              <RoleEditor
                key={current?.id ?? 'new'} role={current}
                onSaved={(id) => setSelection({ kind: 'role', id })} onCancel={() => setSelection({ kind: 'none' })}
              />
            )}
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
