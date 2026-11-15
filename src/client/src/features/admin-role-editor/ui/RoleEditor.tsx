import { Button, Group, Stack, Text, TextInput } from '@mantine/core'
import { useState } from 'react'
import { ChangeList } from '@/shared/ui'
import { hasChanges, listChanges, permissionLabel } from '@/shared/lib'
import type { Role } from '@/entities/reference'
import { tokens } from '@/shared/config/tokens'
import { ConfirmDialog, errorMessage, Panel } from '@/shared/ui'
import { useSaveRole } from '../model/useSaveRole'
import { PermissionChecklist } from './PermissionChecklist'

/**
 * Name and permission checklist of one role; saving shows what is added and removed first. Mount it with
 * `key={role?.id}` so switching roles starts from that role's values.
 */
export function RoleEditor({ role, onSaved, onCancel }: {
  role?: Role
  onSaved: (id: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(role?.name ?? '')
  const [permissions, setPermissions] = useState<string[]>(role?.permissions ?? [])
  const [confirming, setConfirming] = useState(false)
  const [tried, setTried] = useState(false)
  const save = useSaveRole(role, (id) => {
    setConfirming(false)
    onSaved(id)
  })

  const changes = listChanges(role?.permissions ?? [], permissions)
  const renamed = role !== undefined && name.trim() !== role.name
  const nameError = tried && !name.trim() ? 'Вкажіть назву ролі' : null
  const emptyError = tried && permissions.length === 0 ? 'Оберіть хоча б одне право' : null
  const unchanged = tried && role !== undefined && !renamed && !hasChanges(changes) ? 'Змін немає' : null

  const submit = () => {
    setTried(true)
    if (!name.trim() || permissions.length === 0 || (role && !renamed && !hasChanges(changes))) return
    save.reset()
    setConfirming(true)
  }

  return (
    <Panel>
      <Stack gap="md" p="md">
        <TextInput
          label="Назва ролі" required value={name} onChange={(e) => setName(e.currentTarget.value)} error={nameError}
          maw={480}
        />
      </Stack>
      <PermissionChecklist selected={permissions} onChange={setPermissions} />
      <Group justify="space-between" p="md" style={{ borderTop: `1px solid ${tokens.color.line}` }}>
        <Text size="sm" c="red">{emptyError ?? unchanged}</Text>
        <Group gap="sm">
          <Button variant="default" onClick={onCancel}>Скасувати</Button>
          <Button onClick={submit}>{role ? 'Зберегти роль' : 'Створити роль'}</Button>
        </Group>
      </Group>
      <ConfirmDialog
        opened={confirming} title={role ? `Змінити роль «${role.name}»?` : 'Створити роль?'}
        confirmLabel={role ? 'Зберегти зміни' : 'Створити роль'} loading={save.isPending}
        onConfirm={() => save.mutate({ name: name.trim(), permissions })} onClose={() => setConfirming(false)}
      >
        <Text mb="md">
          {role
            ? 'Зміни одразу діятимуть для всіх працівників із цією роллю і потраплять у журнал аудиту.'
            : `Роль «${name.trim()}» матиме ${permissions.length} прав.`}
        </Text>
        <ChangeList
          sections={[
            { title: 'Назва', added: renamed ? [name.trim()] : [], removed: renamed && role ? [role.name] : [] },
            { title: 'Права', added: changes.added.map(permissionLabel), removed: changes.removed.map(permissionLabel) },
          ]}
        />
        {save.isError && <Text c="red" mt="md">{errorMessage(save.error)}</Text>}
      </ConfirmDialog>
    </Panel>
  )
}
