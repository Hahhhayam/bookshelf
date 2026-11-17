import { Alert, Button, Stack, Text } from '@mantine/core'
import { IconRestore } from '@tabler/icons-react'
import { useState } from 'react'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { useActivateBook } from '../model/useActivateBook'

export function ActivateBookButton({ bookId, title }: { bookId: string; title: string }) {
  const [opened, setOpened] = useState(false)
  const activate = useActivateBook(bookId)

  return (
    <>
      <Button variant="default" leftSection={<IconRestore size={16} stroke={1.75} />}
        onClick={() => { activate.reset(); setOpened(true) }}>
        Повернути в продаж
      </Button>
      <ConfirmDialog opened={opened} onClose={() => setOpened(false)} title={`Повернути «${title}» в продаж?`}
        confirmLabel="Повернути в продаж" loading={activate.isPending}
        onConfirm={() => activate.mutate(undefined, { onSuccess: () => setOpened(false) })}>
        <Stack gap="sm">
          <Text size="sm">Книга знову з’явиться на касах і в інтернет-магазині за поточною ціною.</Text>
          {activate.isError && <Alert color="red">{errorMessage(activate.error)}</Alert>}
        </Stack>
      </ConfirmDialog>
    </>
  )
}
