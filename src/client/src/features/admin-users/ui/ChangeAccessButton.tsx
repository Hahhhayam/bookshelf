import { Button, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { ChangeList, FormModal } from '@/shared/ui'
import { hasChanges, listChanges } from '@/shared/lib'
import { referenceApi, useRefreshReference, type User } from '@/entities/reference'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { labelOf, type AccessOptions } from '../model/AccessOptions'
import { AccessFields } from './AccessFields'

type Step = 'closed' | 'edit' | 'confirm'

/** Replaces a user's roles and locations after showing what is added and removed. */
export function ChangeAccessButton({ user, options }: { user: User; options: AccessOptions }) {
  const [step, setStep] = useState<Step>('closed')
  const [roles, setRoles] = useState(user.roles)
  const [locations, setLocations] = useState(user.locations)
  const [tried, setTried] = useState(false)
  const refresh = useRefreshReference()
  const save = useMutation({
    mutationFn: () => referenceApi.changeUserAccess(user.id, roles, locations),
    onSuccess: () => {
      void refresh('users')
      notifications.show({ color: 'green', message: `Права ${user.name} змінено` })
      setStep('closed')
    },
  })

  const open = () => {
    setRoles(user.roles)
    setLocations(user.locations)
    setTried(false)
    save.reset()
    setStep('edit')
  }
  const roleChanges = listChanges(user.roles, roles)
  const locationChanges = listChanges(user.locations, locations)
  const changed = hasChanges(roleChanges) || hasChanges(locationChanges)
  const named = (ids: string[], list: AccessOptions['roles']) => ids.map((id) => labelOf(list, id))

  return (
    <>
      <Button variant="subtle" size="xs" onClick={open}>Змінити доступ</Button>
      <FormModal
        opened={step === 'edit'} title={`Доступ: ${user.name}`} submitLabel="Далі"
        onSubmit={() => (changed ? setStep('confirm') : setTried(true))} onClose={() => setStep('closed')}
        error={tried && !changed ? 'Ролі й локації не змінено' : null}
      >
        <AccessFields options={options} roles={roles} locations={locations} onRoles={setRoles} onLocations={setLocations} />
      </FormModal>
      <ConfirmDialog
        opened={step === 'confirm'} title="Змінити права доступу?" confirmLabel="Змінити права"
        loading={save.isPending} onConfirm={() => save.mutate()} onClose={() => setStep('edit')}
      >
        <Text mb="md">Користувач <strong>{user.name}</strong> отримає такі зміни. Зміну буде записано в журнал аудиту.</Text>
        <ChangeList
          sections={[
            { title: 'Ролі', added: named(roleChanges.added, options.roles), removed: named(roleChanges.removed, options.roles) },
            {
              title: 'Локації',
              added: named(locationChanges.added, options.locations),
              removed: named(locationChanges.removed, options.locations),
            },
          ]}
        />
        {save.isError && <Text c="red" mt="md">{errorMessage(save.error)}</Text>}
      </ConfirmDialog>
    </>
  )
}
