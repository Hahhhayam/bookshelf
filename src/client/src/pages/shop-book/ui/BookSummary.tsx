import { Alert, Group, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { availabilityStatusTone, availabilitySummary, type BookCard } from '@/entities/book'
import { onlyStores, useStores } from '@/entities/store'
import { AddToCartButton } from '@/features/shop-add-to-cart'
import { useMyStore } from '@/features/shop-my-store'
import { tokens } from '@/shared/config/tokens'
import { MoneyText, QuantityStepper, StatusNote } from '@/shared/ui'
import { AvailabilityTable } from './AvailabilityTable'

export function BookSummary({ book, authors }: { book: BookCard; authors: string }) {
  const [quantity, setQuantity] = useState(1)
  const store = useMyStore()
  const atStores = onlyStores(book.availability, useStores().data)
  const availability = availabilitySummary(atStores, store)
  const onSale = book.status === 'Active'

  return (
    <Stack gap="lg" style={{ flex: 1, minWidth: 0 }}>
      <Stack gap={6}>
        <Title order={1} ff="var(--font-display)" fz={{ base: 34, sm: 52 }} lh={1.05}>{book.title}</Title>
        {authors && <Text fz={18} fw={600} c={tokens.color.accent}>{authors}</Text>}
      </Stack>
      <MoneyText value={book.price} variant="strong" size={36} />
      {onSale ? (
        <Group gap="sm" wrap="wrap">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <AddToCartButton book={book} quantity={quantity} size="lg" variant="filled" disabled={availability.tone === 'none'} />
        </Group>
      ) : (
        <Alert color="gray" title="Знято з продажу">Цю книжку зараз не можна замовити.</Alert>
      )}
      <StatusNote tone={availabilityStatusTone[availability.tone]} size={15}>{availability.label}</StatusNote>
      <AvailabilityTable availability={atStores} myStore={store} />
    </Stack>
  )
}
