import { Anchor, Group, Stack } from '@mantine/core'
import { Link } from 'react-router'
import { availabilityStatusTone, availabilitySummary, BookCover, type BookHit } from '@/entities/book'
import { onlyStores, useStores } from '@/entities/store'
import { AddToCartButton } from '@/features/shop-add-to-cart'
import { MoneyText, StatusNote } from '@/shared/ui'

export function BookResultCard({ hit, myStore }: { hit: BookHit; myStore: string | null }) {
  const availability = availabilitySummary(onlyStores(hit.availability, useStores().data), myStore)
  return (
    <Stack component="article" gap={10} justify="space-between">
      <Stack gap={10}>
        <Link to={`/books/${hit.id}`} aria-hidden="true" tabIndex={-1} style={{ textDecoration: 'none' }}>
          <BookCover id={hit.id} title={hit.title} />
        </Link>
        <Anchor component={Link} to={`/books/${hit.id}`} c="var(--mantine-color-text)" fw={600} fz={16} underline="hover">
          {hit.title}
        </Anchor>
        <Group justify="space-between" align="baseline" gap="xs">
          <MoneyText value={hit.price} variant="strong" size={18} />
          <StatusNote tone={availabilityStatusTone[availability.tone]}>{availability.label}</StatusNote>
        </Group>
      </Stack>
      <AddToCartButton book={hit} fullWidth disabled={availability.tone === 'none'} />
    </Stack>
  )
}
