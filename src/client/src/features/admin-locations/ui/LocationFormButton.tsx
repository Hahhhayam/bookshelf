import { Button, Select, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { FormModal } from '@/shared/ui'
import { locationTypeLabel, locationTypes } from '@/entities/reference'
import { referenceApi, useRefreshReference, type Location } from '@/entities/reference'
import { errorMessage } from '@/shared/ui'

type Draft = Pick<Location, 'name' | 'type' | 'address'>

const typeOptions = locationTypes.map((type) => ({ value: type, label: locationTypeLabel[type] }))

async function saveLocation(existing: Location | undefined, draft: Draft) {
  if (!existing) return referenceApi.createLocation(draft.name, draft.type, draft.address)
  await referenceApi.updateLocation(existing, draft.name, draft.address)
  return existing.id
}

/** Creates a location, or edits the name and address of one (its type cannot change on the server). */
export function LocationFormButton({ location }: { location?: Location }) {
  const initial: Draft = { name: location?.name ?? '', type: location?.type ?? 'Store', address: location?.address ?? '' }
  const [opened, setOpened] = useState(false)
  const [draft, setDraft] = useState(initial)
  const [tried, setTried] = useState(false)
  const refresh = useRefreshReference()
  const save = useMutation({
    mutationFn: () => saveLocation(location, { ...draft, name: draft.name.trim(), address: draft.address.trim() }),
    onSuccess: () => {
      void refresh('locations')
      notifications.show({ color: 'green', message: location ? 'Локацію збережено' : `Локацію «${draft.name.trim()}» створено` })
      setOpened(false)
    },
  })

  const open = () => {
    setDraft(initial)
    setTried(false)
    save.reset()
    setOpened(true)
  }
  const submit = () => {
    setTried(true)
    if (draft.name.trim() && draft.address.trim()) save.mutate()
  }

  return (
    <>
      {location
        ? <Button variant="subtle" size="xs" onClick={open}>Редагувати</Button>
        : <Button leftSection={<IconPlus size={18} stroke={1.75} />} onClick={open}>Нова локація</Button>}
      <FormModal
        opened={opened} title={location ? `Локація «${location.name}»` : 'Нова локація'}
        submitLabel={location ? 'Зберегти' : 'Створити локацію'} onSubmit={submit} onClose={() => setOpened(false)}
        loading={save.isPending} error={save.isError ? errorMessage(save.error) : null}
      >
        <TextInput
          label="Назва" required data-autofocus value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.currentTarget.value })}
          error={tried && !draft.name.trim() ? 'Вкажіть назву' : null}
        />
        <Select
          label="Тип" data={typeOptions} value={draft.type} allowDeselect={false} disabled={!!location}
          onChange={(value) => value && setDraft({ ...draft, type: value as Location['type'] })}
          description={location ? 'Тип локації не змінюється після створення' : undefined}
        />
        <TextInput
          label="Адреса" required value={draft.address}
          onChange={(e) => setDraft({ ...draft, address: e.currentTarget.value })}
          error={tried && !draft.address.trim() ? 'Вкажіть адресу' : null}
        />
      </FormModal>
    </>
  )
}
