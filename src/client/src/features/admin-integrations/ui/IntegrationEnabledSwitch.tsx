import { Switch, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { referenceApi, useRefreshReference, type Integration } from '@/entities/reference'
import { ConfirmDialog, errorMessage } from '@/shared/ui'

/** Enables or disables one connection; the switch only asks, the dialog does it. */
export function IntegrationEnabledSwitch({ integration }: { integration: Integration }) {
  const [opened, setOpened] = useState(false)
  const refresh = useRefreshReference()
  const next = !integration.enabled
  const toggle = useMutation({
    mutationFn: () => referenceApi.setIntegrationEnabled(integration.id, next),
    onSuccess: () => {
      void refresh('integrations')
      notifications.show({ color: 'green', message: `«${integration.name}» ${next ? 'увімкнено' : 'вимкнено'}` })
      setOpened(false)
    },
  })
  const open = () => {
    toggle.reset()
    setOpened(true)
  }

  return (
    <>
      <Switch
        checked={integration.enabled} onChange={open} aria-label={`${integration.name}: ${integration.enabled ? 'увімкнено' : 'вимкнено'}`}
      />
      <ConfirmDialog
        opened={opened} danger={!next} loading={toggle.isPending}
        title={next ? 'Увімкнути інтеграцію?' : 'Вимкнути інтеграцію?'}
        confirmLabel={next ? 'Увімкнути' : 'Вимкнути'} onConfirm={() => toggle.mutate()} onClose={() => setOpened(false)}
      >
        <Text>
          {next
            ? `Система знову обмінюватиметься даними через «${integration.name}».`
            : `Обмін даними через «${integration.name}» зупиниться, доки підключення не ввімкнуть знову.`}
        </Text>
        {toggle.isError && <Text c="red" mt="md">{errorMessage(toggle.error)}</Text>}
      </ConfirmDialog>
    </>
  )
}
