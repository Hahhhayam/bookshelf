import { Alert, Button, Stack, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import type { RemovalMode } from '@/entities/book'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { useRemoveBook } from '../model/useRemoveBook'

export function RemoveBookButton({ bookId, title, onRemoved }: {
  bookId: string
  title: string
  onRemoved: (mode: RemovalMode) => void
}) {
  const [opened, setOpened] = useState(false)
  const remove = useRemoveBook(bookId)

  function confirm() {
    remove.mutate(undefined, { onSuccess: ({ mode }) => { setOpened(false); onRemoved(mode) } })
  }

  return (
    <>
      <Button variant="subtle" color="red" leftSection={<IconTrash size={16} stroke={1.75} />}
        onClick={() => { remove.reset(); setOpened(true) }}>
        Видалити / деактивувати
      </Button>
      <ConfirmDialog opened={opened} onClose={() => setOpened(false)} title={`Прибрати «${title}» з каталогу?`}
        confirmLabel="Видалити / деактивувати" danger loading={remove.isPending} onConfirm={confirm}>
        <Stack gap="sm">
          <Text size="sm">
            Якщо на книгу є відкриті замовлення чи залишки, її буде <strong>деактивовано</strong>: вона зникне з кас
            і магазину, але залишиться в документах. Інакше книгу буде <strong>видалено</strong> назавжди.
          </Text>
          {remove.isError && <Alert color="red">{errorMessage(remove.error)}</Alert>}
        </Stack>
      </ConfirmDialog>
    </>
  )
}
