import { Stack } from '@mantine/core'
import { IconBooks } from '@tabler/icons-react'
import { EmptyState } from '@/shared/ui'
import { FacetFilter, type Facets } from './FacetFilter'

export function CatalogStart({ onFacetsChange }: { onFacetsChange: (next: Facets) => void }) {
  return (
    <Stack align="center" gap="lg">
      <EmptyState
        icon={<IconBooks size={48} stroke={1.5} />}
        title="Що почитаємо?"
        text="Введіть назву, автора або ISBN у пошук угорі або оберіть категорію чи видавництво — покажемо ціну й наявність у магазинах."
      />
      <FacetFilter value={{ category: null, publisher: null }} onChange={onFacetsChange} />
    </Stack>
  )
}
