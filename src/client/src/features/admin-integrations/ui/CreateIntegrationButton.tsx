import { Button, Select, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { FormModal } from '@/shared/ui'
import { integrationKindLabel, integrationKinds } from '@/entities/reference'
import { referenceApi, useRefreshReference, type IntegrationKind } from '@/entities/reference'
import { errorMessage } from '@/shared/ui'

const kindOptions = integrationKinds.map((kind) => ({ value: kind, label: integrationKindLabel[kind] }))

/** Registers one connection to an external system; it starts enabled. */
export function CreateIntegrationButton() {
  const [opened, setOpened] = useState(false)
  const [kind, setKind] = useState<IntegrationKind>('Payment')
  const [name, setName] = useState('')
  const [tried, setTried] = useState(false)
  const refresh = useRefreshReference()
  const create = useMutation({
    mutationFn: () => referenceApi.createIntegration(kind, name.trim()),
    onSuccess: () => {
      void refresh('integrations')
      notifications.show({ color: 'green', message: `Інтеграцію «${name.trim()}» додано й увімкнено` })
      setOpened(false)
    },
  })

  const open = () => {
    setKind('Payment')
    setName('')
    setTried(false)
    create.reset()
    setOpened(true)
  }
  const submit = () => {
    setTried(true)
    if (name.trim()) create.mutate()
  }

  return (
    <>
      <Button leftSection={<IconPlus size={18} stroke={1.75} />} onClick={open}>Нове підключення</Button>
      <FormModal
        opened={opened} title="Нове підключення" submitLabel="Додати підключення" onSubmit={submit}
        onClose={() => setOpened(false)} loading={create.isPending} error={create.isError ? errorMessage(create.error) : null}
      >
        <Select
          label="Тип" data={kindOptions} value={kind} allowDeselect={false}
          onChange={(value) => value && setKind(value as IntegrationKind)}
          description="Можна мати кілька підключень одного типу, наприклад два платіжні сервіси"
        />
        <TextInput
          label="Назва" required data-autofocus value={name} placeholder="Напр., LiqPay — каси магазинів"
          onChange={(e) => setName(e.currentTarget.value)} error={tried && !name.trim() ? 'Вкажіть назву' : null}
        />
      </FormModal>
    </>
  )
}
