import { Button, Flex, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconSearchOff } from '@tabler/icons-react'
import { stockedLocations, useBookSearch, type BookHit } from '@/entities/book'
import { useMyStore } from '@/features/shop-my-store'
import { plural } from '@/shared/lib'
import { EmptyState, QueryView } from '@/shared/ui'
import { BookResultCard } from './BookResultCard'
import { StoreFilter } from './StoreFilter'

const bookForms = ['книжка', 'книжки', 'книжок'] as const

export function CatalogSearch({ text, onlyMyStore, onOnlyMyStoreChange }: {
  text: string
  onlyMyStore: boolean
  onOnlyMyStoreChange: (on: boolean) => void
}) {
  const store = useMyStore()
  const availableAt = onlyMyStore && store ? store : undefined
  const all = useBookSearch({ text })
  const filtered = useBookSearch({ text, availableAt }, !!availableAt)
  const results = availableAt ? filtered : all
  // GAP-14: the stores to choose from are the ones that appear in these results' availability.
  const locations = [...new Set((all.data ?? []).flatMap((hit) => stockedLocations(hit.availability)))]

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Text size="md" c="dimmed">Результати пошуку</Text>
        <Title order={1} ff="var(--font-display)" fz={{ base: 28, sm: 38 }}>
          «{text}»{results.data ? ` — ${results.data.length} ${plural(results.data.length, bookForms)}` : ''}
        </Title>
      </Stack>
      <Flex gap="xl" direction={{ base: 'column', md: 'row' }} align="flex-start">
        <StoreFilter locations={locations} onlyMyStore={onlyMyStore} onChange={onOnlyMyStoreChange} />
        <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
          <QueryView query={results} isEmpty={(hits) => hits.length === 0}
            empty={<NothingFound text={text} onlyMyStore={onlyMyStore} onShowAll={() => onOnlyMyStoreChange(false)} />}>
            {(hits) => <ResultGrid hits={hits} myStore={store} />}
          </QueryView>
        </div>
      </Flex>
    </Stack>
  )
}

function ResultGrid({ hits, myStore }: { hits: BookHit[]; myStore: string | null }) {
  return (
    <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing={{ base: 'md', sm: 'lg' }} verticalSpacing="xl">
      {hits.map((hit) => <BookResultCard key={hit.id} hit={hit} myStore={myStore} />)}
    </SimpleGrid>
  )
}

function NothingFound({ text, onlyMyStore, onShowAll }: { text: string; onlyMyStore: boolean; onShowAll: () => void }) {
  return (
    <EmptyState
      icon={<IconSearchOff size={44} stroke={1.5} />}
      title={`Нічого не знайдено за «${text}»`}
      text={onlyMyStore ? 'У вашому магазині такої книжки зараз немає.' : 'Перевірте написання або спробуйте коротший запит.'}
      actions={onlyMyStore ? <Button variant="outline" onClick={onShowAll}>Шукати в усіх магазинах</Button> : undefined}
    />
  )
}
