import { IconBooks } from '@tabler/icons-react'
import { EmptyState } from '@/shared/ui'

export function CatalogStart() {
  return (
    <EmptyState
      icon={<IconBooks size={48} stroke={1.5} />}
      title="Що почитаємо?"
      text="Введіть назву, автора або ISBN у пошук угорі — покажемо ціну й де книжку можна забрати сьогодні."
    />
  )
}
