import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { referenceApi, useRefreshReference } from '@/entities/reference'
import { errorMessage } from '@/shared/ui'

export type ManagedReferenceKind = 'authors' | 'publishers' | 'categories'

const create: Record<ManagedReferenceKind, (name: string) => Promise<string>> = {
  authors: referenceApi.createAuthor,
  publishers: referenceApi.createPublisher,
  categories: referenceApi.createCategory,
}

const rename: Record<ManagedReferenceKind, (id: string, name: string) => Promise<void>> = {
  authors: referenceApi.renameAuthor,
  publishers: referenceApi.renamePublisher,
  categories: referenceApi.renameCategory,
}

/** Categories can only be renamed (FR-02), so they have no active switch. */
const setActive: Partial<Record<ManagedReferenceKind, (id: string, active: boolean) => Promise<void>>> = {
  authors: referenceApi.setAuthorActive,
  publishers: referenceApi.setPublisherActive,
}

function failed(error: unknown) {
  notifications.show({ color: 'red', title: 'Не вдалося зберегти', message: errorMessage(error) })
}

function saved(message: string) {
  notifications.show({ color: 'green', message })
}

export function useReferenceCommands(kind: ManagedReferenceKind) {
  const refresh = useRefreshReference()
  const createOne = useMutation({
    mutationFn: (name: string) => create[kind](name.trim()),
    onSuccess: async (_id, name) => { await refresh(kind); saved(`Додано: ${name.trim()}`) },
    onError: failed,
  })
  const renameOne = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => rename[kind](id, name.trim()),
    onSuccess: async () => { await refresh(kind); saved('Назву змінено') },
  })
  const toggle = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => setActive[kind]!(id, active),
    onSuccess: async (_none, { active }) => { await refresh(kind); saved(active ? 'Активовано' : 'Деактивовано') },
    onError: failed,
  })
  return { create: createOne, rename: renameOne, toggle, canToggle: kind in setActive }
}
