import { Button, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { referenceApi, useRefreshReference, type User } from '@/entities/reference'
import { ConfirmDialog, errorMessage } from '@/shared/ui'

/** Blocks or restores a user; both ask first, since blocking ends the person's work at once. */
export function BlockUserButton({ user }: { user: User }) {
  const [opened, setOpened] = useState(false)
  const refresh = useRefreshReference()
  const toggle = useMutation({
    mutationFn: () => (user.blocked ? referenceApi.unblockUser(user.id) : referenceApi.blockUser(user.id)),
    onSuccess: () => {
      void refresh('users')
      notifications.show({ color: 'green', message: user.blocked ? `${user.name} розблоковано` : `${user.name} заблоковано` })
      setOpened(false)
    },
  })
  const open = () => {
    toggle.reset()
    setOpened(true)
  }

  return (
    <>
      <Button variant="subtle" size="xs" color={user.blocked ? undefined : 'red'} onClick={open}>
        {user.blocked ? 'Розблокувати' : 'Заблокувати'}
      </Button>
      <ConfirmDialog
        opened={opened} danger={!user.blocked} loading={toggle.isPending}
        title={user.blocked ? 'Розблокувати користувача?' : 'Заблокувати користувача?'}
        confirmLabel={user.blocked ? `Розблокувати ${user.name}` : `Заблокувати ${user.name}`}
        onConfirm={() => toggle.mutate()} onClose={() => setOpened(false)}
      >
        <Text>
          {user.blocked
            ? `${user.name} знову зможе входити з поточними ролями й доступом до локацій.`
            : `${user.name} більше не зможе увійти. Ролі й доступ збережуться — їх можна буде повернути розблокуванням.`}
        </Text>
        {toggle.isError && <Text c="red" mt="md">{errorMessage(toggle.error)}</Text>}
      </ConfirmDialog>
    </>
  )
}
