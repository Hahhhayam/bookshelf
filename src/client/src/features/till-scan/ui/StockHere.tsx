import { Text } from '@mantine/core'
import { availableAt, type BookHit } from '@/entities/book'
import { tokens } from '@/shared/config/tokens'

export function StockHere({ hit, locationId }: { hit: BookHit; locationId: string }) {
  const here = availableAt(hit, locationId) ?? 0
  return <Text fz={13} c={here > 0 ? tokens.color.ink2 : tokens.color.danger}>В магазині: {here} шт.</Text>
}
