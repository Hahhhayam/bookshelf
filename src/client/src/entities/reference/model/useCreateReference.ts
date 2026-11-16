import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { errorMessage } from '@/shared/ui'
import { referenceApi } from '../api/referenceApi'
import { useRefreshReference } from './queries'

export type CatalogReferenceKind = 'authors' | 'publishers' | 'categories'

const create: Record<CatalogReferenceKind, (name: string) => Promise<string>> = {
  authors: referenceApi.createAuthor,
  publishers: referenceApi.createPublisher,
  categories: referenceApi.createCategory,
}

const createdText: Record<CatalogReferenceKind, string> = {
  authors: 'Автора додано',
  publishers: 'Видавництво додано',
  categories: 'Категорію додано',
}

/** Creates an author, publisher or category by name and refreshes the remembered list (GAP-03). */
export function useCreateReference(kind: CatalogReferenceKind) {
  const refresh = useRefreshReference()
  return useMutation({
    mutationFn: (name: string) => create[kind](name.trim()),
    onSuccess: async (_id, name) => {
      await refresh(kind)
      notifications.show({ color: 'green', message: `${createdText[kind]}: ${name.trim()}` })
    },
    onError: (error) => notifications.show({ color: 'red', title: 'Не вдалося створити', message: errorMessage(error) }),
  })
}
