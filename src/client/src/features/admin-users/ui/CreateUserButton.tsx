import { Button, PasswordInput, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUserPlus } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { FormModal } from '@/shared/ui'
import { referenceApi, useRefreshReference } from '@/entities/reference'
import { errorMessage } from '@/shared/ui'
import type { AccessOptions } from '../model/AccessOptions'
import { AccessFields } from './AccessFields'

const empty = { login: '', password: '', roles: [] as string[], locations: [] as string[] }

export function CreateUserButton({ options }: { options: AccessOptions }) {
  const [opened, setOpened] = useState(false)
  const [form, setForm] = useState(empty)
  const [touched, setTouched] = useState(false)
  const refresh = useRefreshReference()
  const create = useMutation({
    mutationFn: () => referenceApi.createUser(form.login.trim(), form.password, form.roles, form.locations),
    onSuccess: () => {
      void refresh('users')
      notifications.show({ color: 'green', message: `Користувача ${form.login.trim()} створено` })
      close()
    },
  })

  const close = () => {
    setOpened(false)
    setForm(empty)
    setTouched(false)
    create.reset()
  }
  const invalid = !form.login.trim() || !form.password || form.roles.length === 0
  const submit = () => {
    setTouched(true)
    if (!invalid) create.mutate()
  }

  return (
    <>
      <Button leftSection={<IconUserPlus size={18} stroke={1.75} />} onClick={() => setOpened(true)}>Новий користувач</Button>
      <FormModal
        opened={opened} title="Новий користувач" submitLabel="Створити користувача" onSubmit={submit} onClose={close}
        loading={create.isPending} error={create.isError ? errorMessage(create.error) : null}
      >
        <TextInput
          label="Логін" required data-autofocus value={form.login} autoComplete="off"
          onChange={(e) => setForm({ ...form, login: e.currentTarget.value })}
          error={touched && !form.login.trim() ? 'Вкажіть логін' : null}
        />
        <PasswordInput
          label="Початковий пароль" required value={form.password} autoComplete="new-password"
          onChange={(e) => setForm({ ...form, password: e.currentTarget.value })}
          error={touched && !form.password ? 'Вкажіть пароль' : null}
          description="Передайте його працівнику особисто"
        />
        <AccessFields
          options={options} roles={form.roles} locations={form.locations}
          onRoles={(roles) => setForm({ ...form, roles })} onLocations={(locations) => setForm({ ...form, locations })}
          error={touched && form.roles.length === 0 ? 'Потрібна хоча б одна роль' : null}
        />
      </FormModal>
    </>
  )
}
