import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { errorMessage } from '@/shared/ui'
import { contactSchema, type ContactValues } from '../model/schema'
import { useEditContact } from '../model/useEditContact'

/** Keeping the customer base: a CRM manager corrects the name, phone or e-mail. */
export function EditContactButton({ customerId, current }: { customerId: string; current: ContactValues }) {
  const [opened, setOpened] = useState(false)
  const edit = useEditContact(customerId)
  const form = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: current })
  const { register, formState: { errors } } = form

  function open() { form.reset(current); edit.reset(); setOpened(true) }
  function submit(values: ContactValues) { edit.mutate(values, { onSuccess: () => setOpened(false) }) }

  return (
    <>
      <Button variant="subtle" size="xs" onClick={open}>Змінити контакти</Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Контакти клієнта" centered>
        <form onSubmit={form.handleSubmit(submit)} noValidate aria-label="Контакти клієнта">
          <Stack gap="md">
            <TextInput label="Ім’я" withAsterisk {...register('name')} error={errors.name?.message} />
            <TextInput label="Телефон" {...register('phone')} error={errors.phone?.message} placeholder="+380…" />
            <TextInput label="E-mail" {...register('email')} error={errors.email?.message} />
            {edit.isError && <Alert color="red">{errorMessage(edit.error)}</Alert>}
            <Group justify="flex-end" gap="sm">
              <Button variant="default" onClick={() => setOpened(false)}>Скасувати</Button>
              <Button type="submit" loading={edit.isPending}>Зберегти</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  )
}
