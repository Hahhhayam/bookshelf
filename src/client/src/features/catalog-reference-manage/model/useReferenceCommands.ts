import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { referenceApi, useCreateReference, useRefreshReference, type CatalogReferenceKind } from '@/entities/reference'
import { errorMessage } from '@/shared/ui'

const rename: Record<CatalogReferenceKind, (id: string, name: string) => Promise<void>> = {
  authors: referenceApi.renameAuthor,
  publishers: referenceApi.renamePublisher,
  categories: referenceApi.renameCategory,
}

/** Categories can only be renamed (FR-02), so they have no active switch. */
const setActive: Partial<Record<CatalogReferenceKind, (id: string, active: boolean) => Promise<void>>> = {
  authors: referenceApi.setAuthorActive,
  publishers: referenceApi.setPublisherActive,
}

function failed(error: unknown) {
  notifications.show({ color: 'red', title: 'Не вдалося зберегти', message: errorMessage(error) })
}

function saved(message: string) {
  notifications.show({ color: 'green', message })
}

export function useReferenceCommands(kind: CatalogReferenceKind) {
  const refresh = useRefreshReference()
  const createOne = useCreateReference(kind)
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
