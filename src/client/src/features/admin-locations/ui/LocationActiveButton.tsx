import { Button, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { referenceApi, useRefreshReference, type Location } from '@/entities/reference'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { rememberBeforeChange } from '../model/remember'

/** Deactivates or reactivates a location after confirmation. */
export function LocationActiveButton({ location }: { location: Location }) {
  const [opened, setOpened] = useState(false)
  const refresh = useRefreshReference()
  const next = !location.active
  const toggle = useMutation({
    mutationFn: async () => {
      rememberBeforeChange(location)
      await referenceApi.setLocationActive(location.id, next)
    },
    onSuccess: () => {
      void refresh('locations')
      notifications.show({ color: 'green', message: next ? `«${location.name}» активовано` : `«${location.name}» деактивовано` })
      setOpened(false)
    },
  })
  const open = () => {
    toggle.reset()
    setOpened(true)
  }

  return (
    <>
      <Button variant="subtle" size="xs" color={next ? undefined : 'red'} onClick={open}>
        {next ? 'Активувати' : 'Деактивувати'}
      </Button>
      <ConfirmDialog
        opened={opened} danger={!next} loading={toggle.isPending}
        title={next ? 'Активувати локацію?' : 'Деактивувати локацію?'}
        confirmLabel={next ? 'Активувати' : 'Деактивувати'}
        onConfirm={() => toggle.mutate()} onClose={() => setOpened(false)}
      >
        <Text>
          {next
            ? `«${location.name}» знову з’явиться у виборі локацій для продажів, переміщень і замовлень.`
            : `«${location.name}» зникне з вибору для нових продажів, переміщень і замовлень. Історія й залишки збережуться.`}
        </Text>
        {toggle.isError && <Text c="red" mt="md">{errorMessage(toggle.error)}</Text>}
      </ConfirmDialog>
    </>
  )
}
