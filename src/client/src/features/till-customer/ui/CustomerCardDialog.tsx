import { Alert, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { IconId } from '@tabler/icons-react'
import { useState, type KeyboardEvent } from 'react'
import { customerApi, type CustomerCard } from '@/entities/customer'
import { ApiError } from '@/shared/api'
import { tokens } from '@/shared/config/tokens'
import { errorMessage, Key } from '@/shared/ui'

function lookupError(error: unknown) {
  return error instanceof ApiError && error.status === 404 ? 'Клієнта з такою карткою не знайдено.' : errorMessage(error)
}

/** F4: the customer by loyalty card. */
export function CustomerCardDialog({ opened, hasCustomer, onFound, onClear, onClose }: {
  opened: boolean
  hasCustomer: boolean
  onFound: (customer: CustomerCard) => void
  onClear: () => void
  onClose: () => void
}) {
  const [card, setCard] = useState('')
  const lookup = useMutation({ mutationFn: (number: string) => customerApi.byCard(number) })

  function close() {
    setCard('')
    lookup.reset()
    onClose()
  }
  function find() {
    if (!card.trim()) return
    lookup.mutate(card.trim(), { onSuccess: (customer) => { onFound(customer); close() } })
  }
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return
    event.preventDefault()
    find()
  }

  return (
    <Modal opened={opened} onClose={close} centered title={<Text fw={600} fz={20}>Клієнт</Text>}>
      <Stack gap="md">
        <TextInput data-autofocus size="lg" label="Номер картки лояльності" placeholder="Скануйте картку"
          leftSection={<IconId size={20} stroke={1.75} />} value={card} onKeyDown={onKeyDown}
          onChange={(e) => setCard(e.currentTarget.value)} styles={{ input: { fontFamily: tokens.font.mono } }} />
        {lookup.isError && <Alert color="red" variant="light">{lookupError(lookup.error)}</Alert>}
        <Group justify="space-between">
          {hasCustomer
            ? <Button variant="subtle" color="red" onClick={() => { onClear(); close() }}>Прибрати клієнта з чека</Button>
            : <span />}
          <Group gap="sm">
            <Button variant="default" onClick={close} rightSection={<Key>Esc</Key>}>Назад</Button>
            <Button loading={lookup.isPending} onClick={find} rightSection={<Key inverted>Enter</Key>}>Знайти</Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  )
}
