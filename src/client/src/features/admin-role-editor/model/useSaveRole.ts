import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { referenceApi, useRefreshReference, type Role } from '@/entities/reference'

/** Creates a role or replaces an existing one's name and permissions as a whole (FR-19). */
export function useSaveRole(role: Role | undefined, onSaved: (id: string) => void) {
  const refresh = useRefreshReference()
  return useMutation({
    mutationFn: async ({ name, permissions }: { name: string; permissions: string[] }) => {
      if (!role) return referenceApi.createRole(name, permissions)
      await referenceApi.updateRole(role.id, name, permissions)
      return role.id
    },
    onSuccess: (id, { name }) => {
      void refresh('roles')
      notifications.show({ color: 'green', message: role ? `Роль «${name}» збережено` : `Роль «${name}» створено` })
      onSaved(id)
    },
  })
}
