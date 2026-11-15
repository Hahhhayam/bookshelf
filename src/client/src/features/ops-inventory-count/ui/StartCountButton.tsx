import { Button, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { useStartCount } from '../model/counts'

export function StartCountButton({ location, onStarted }: {
  location: { id: string; name: string }
  onStarted: (id: string) => void
}) {
  const [opened, setOpened] = useState(false)
  const start = useStartCount()

  function close() {
    start.reset()
    setOpened(false)
  }

  return (
    <>
      <Button leftSection={<IconPlus size={16} stroke={1.75} />} onClick={() => setOpened(true)}>Почати інвентаризацію</Button>
      <ConfirmDialog
        opened={opened}
        title="Почати інвентаризацію?"
        confirmLabel="Почати"
        loading={start.isPending}
        onConfirm={() => start.mutate(location.id, { onSuccess: onStarted })}
        onClose={close}
      >
        <Text size="md">
          Буде відкрито лист перерахунку для локації «{location.name}». Рахуйте книжки скануванням або вводьте кількість
          вручну.
        </Text>
        {start.isError && <Text size="sm" c="red" mt="sm">{errorMessage(start.error)}</Text>}
      </ConfirmDialog>
    </>
  )
}
