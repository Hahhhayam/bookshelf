import { Alert, Button, Group, Modal, Stack } from '@mantine/core'
import { useState } from 'react'
import { errorMessage } from '@/shared/ui'
import { useChangeSegments } from '../model/useChangeSegments'
import { SegmentsPicker } from './SegmentsPicker'

export function ChangeSegmentsButton({ customerId, current }: { customerId: string; current: string[] }) {
  const [opened, setOpened] = useState(false)
  const [value, setValue] = useState(current)
  const change = useChangeSegments(customerId)

  function open() { setValue(current); change.reset(); setOpened(true) }

  return (
    <>
      <Button variant="subtle" size="xs" onClick={open}>Змінити сегменти</Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Сегменти клієнта" centered>
        <Stack gap="md">
          <SegmentsPicker value={value} onChange={setValue} />
          {change.isError && <Alert color="red">{errorMessage(change.error)}</Alert>}
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={() => setOpened(false)}>Скасувати</Button>
            <Button loading={change.isPending} onClick={() => change.mutate(value, { onSuccess: () => setOpened(false) })}>Зберегти</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
