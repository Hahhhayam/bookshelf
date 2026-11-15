import { Alert, Button, Group, Modal, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { useState, type FormEvent } from 'react'
import type { Supplier } from '@/entities/reference'
import { errorMessage } from '@/shared/ui'
import { useSaveSupplier } from '../model/useSupplierMutations'

/** Create or edit a supplier: name and contact. Mount it with a `key` per supplier so the fields start fresh. */
export function SupplierFormDialog({ opened, supplier, onClose, onSaved }: {
  opened: boolean
  supplier?: Supplier
  onClose: () => void
  onSaved?: (id: string) => void
}) {
  const [name, setName] = useState(supplier?.name ?? '')
  const [contact, setContact] = useState(supplier?.contactInfo ?? '')
  const [touched, setTouched] = useState(false)
  const save = useSaveSupplier()
  const nameError = touched && !name.trim() ? 'Вкажіть назву постачальника' : undefined

  function submit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (!name.trim()) return
    save.mutate(
      { id: supplier?.id, name: name.trim(), contactInfo: contact.trim() || null },
      { onSuccess: (id) => { onSaved?.(id); onClose() } },
    )
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      shadow="xl"
      title={(
        <Stack gap={4}>
          <Text fw={600} fz={20}>{supplier ? 'Редагувати постачальника' : 'Новий постачальник'}</Text>
          {supplier && <Text size="sm" c="dimmed">{supplier.name}</Text>}
        </Stack>
      )}
    >
      <form onSubmit={submit} noValidate>
        <Stack gap="md">
          <TextInput label="Назва" required data-autofocus value={name} error={nameError}
            onChange={(event) => setName(event.currentTarget.value)} placeholder="Видавництво «Ранок»" />
          <Textarea label="Контакти" autosize minRows={2} value={contact}
            onChange={(event) => setContact(event.currentTarget.value)}
            placeholder="Менеджер, телефон, e-mail для замовлень" />
          {save.isError && <Alert color="red" variant="light">{errorMessage(save.error)}</Alert>}
          <Group justify="flex-end" gap="sm" mt="xs">
            <Button variant="default" onClick={onClose}>Скасувати</Button>
            <Button type="submit" loading={save.isPending}>{supplier ? 'Зберегти зміни' : 'Додати постачальника'}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
