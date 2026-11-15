import { Button, Group, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { customerApi, customerKeys } from '@/entities/customer'
import { ApiError } from '@/shared/api'
import { tokens } from '@/shared/config/tokens'
import { errorMessage } from '@/shared/ui'

const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Finds a customer by loyalty card number (scanned or typed); there is no search by name or phone (GAP-11). */
export function FindByCardForm({ onFound }: { onFound: (customerId: string) => void }) {
  const client = useQueryClient()
  const [card, setCard] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    const number = card.trim()
    if (!number) return setError('Вкажіть номер картки')
    setBusy(true)
    try {
      const found = await client.fetchQuery({ queryKey: customerKeys.byCard(number), queryFn: () => customerApi.byCard(number), retry: false })
      onFound(found.id)
    } catch (e) {
      setError(e instanceof ApiError && e.status === 404 ? `Клієнта з карткою ${number} не знайдено` : errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)}>
      <Group align="flex-start" gap="sm">
        <TextInput label="Номер картки лояльності" placeholder="Скануйте або введіть" autoFocus value={card} error={error}
          style={{ flex: '1 1 220px' }} styles={{ input: { fontFamily: tokens.font.mono } }}
          onChange={(e) => { setCard(e.currentTarget.value); setError(null) }} />
        <Button type="submit" mt={25} loading={busy} leftSection={<IconSearch size={16} />}>Знайти</Button>
      </Group>
    </form>
  )
}

/** Opens a card by the customer id copied from a receipt, an order or the audit log. */
export function OpenByIdForm({ onOpen }: { onOpen: (customerId: string) => void }) {
  const [id, setId] = useState('')
  const [error, setError] = useState<string | null>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!guid.test(id.trim())) return setError('Ідентифікатор має вигляд xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
    onOpen(id.trim())
  }

  return (
    <form onSubmit={submit}>
      <Group align="flex-start" gap="sm">
        <TextInput label="Ідентифікатор клієнта" value={id} error={error} style={{ flex: '1 1 220px' }}
          styles={{ input: { fontFamily: tokens.font.mono } }} onChange={(e) => { setId(e.currentTarget.value); setError(null) }} />
        <Button type="submit" variant="default" mt={25}>Відкрити</Button>
      </Group>
    </form>
  )
}
