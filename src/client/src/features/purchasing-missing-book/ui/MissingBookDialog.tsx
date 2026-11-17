import { Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { FormModal, errorMessage } from '@/shared/ui'
import { useRecordMissingBook } from '../model/useRecordMissingBook'

/** Records demand for a book that is not here (table 2.7), so the purchasing manager sees it when forming the need. */
export function MissingBookDialog({ location, initialTitle, onClose }: {
  location: string
  initialTitle: string
  onClose: () => void
}) {
  const record = useRecordMissingBook(location)
  const [title, setTitle] = useState(initialTitle)
  const [author, setAuthor] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const titleError = submitted && !title.trim() ? 'Вкажіть назву книги' : null

  function submit() {
    setSubmitted(true)
    if (!title.trim()) return
    record.mutate({ title: title.trim(), author: author.trim() || null }, {
      onSuccess: () => {
        notifications.show({ color: 'green', message: 'Запит на відсутню книгу записано' })
        onClose()
      },
    })
  }

  return (
    <FormModal
      opened
      title="Запит на відсутню книгу"
      submitLabel="Записати запит"
      loading={record.isPending}
      error={record.isError ? errorMessage(record.error) : null}
      onSubmit={submit}
      onClose={onClose}
    >
      <Text size="sm">Запит потрапить до менеджера із закупівель. Повторний запит на ту саму назву збільшить попит.</Text>
      <TextInput label="Назва" required data-autofocus value={title} error={titleError}
        onChange={(event) => setTitle(event.currentTarget.value)} />
      <TextInput label="Автор" value={author} onChange={(event) => setAuthor(event.currentTarget.value)} />
    </FormModal>
  )
}
