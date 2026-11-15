import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError, uah } from '@/shared/api'
import { bookKeys } from '@/entities/book'
import { cartTotal, type CartLine } from '@/entities/cart'
import { orderApi, type PlaceOrder } from '@/entities/order'
import type { PlacedOrderSummary } from './placedSummary'
import { sentLines } from './sentLines'

export interface PlaceOrderInput {
  customer: string
  lines: readonly CartLine[]
  stockLocation: string
  fulfilment: PlaceOrder['fulfilment']
}

function refuseShrunkLines(lines: readonly CartLine[], sent: Record<string, number>) {
  const shrunk = Object.entries(sent).filter(([book, quantity]) => (lines.find((l) => l.book === book)?.quantity ?? 0) < quantity)
  if (shrunk.length === 0) return
  const titles = shrunk.map(([book]) => lines.find((l) => l.book === book)?.title ?? 'книжку').map((t) => `«${t}»`)
  throw new ApiError(422, `${titles.join(', ')} уже передано магазину в більшій кількості, а зменшити її поки неможливо. `
    + 'Поверніть попередню кількість у кошику або зверніться в магазин.')
}

/** The cart lives in the browser (GAP-01); right before placing the order it is copied to the server cart. */
async function syncServerCart(customer: string, lines: readonly CartLine[]) {
  const sent = sentLines.read(customer)
  refuseShrunkLines(lines, sent)
  for (const line of lines) {
    const delta = line.quantity - (sent[line.book] ?? 0)
    if (delta <= 0) continue
    await orderApi.addToCart(customer, line.book, delta)
    sent[line.book] = line.quantity
    sentLines.write(customer, sent)
  }
}

async function placeOrder(input: PlaceOrderInput): Promise<PlacedOrderSummary> {
  await syncServerCart(input.customer, input.lines)
  const placed = await orderApi.place({ customer: input.customer, type: 'Retail', stockLocation: input.stockLocation, fulfilment: input.fulfilment })
  sentLines.clear(input.customer)
  return {
    ...placed,
    lines: input.lines.map((l) => ({ book: l.book, title: l.title, quantity: l.quantity, price: l.price })),
    total: uah(cartTotal(input.lines)),
    store: input.fulfilment.pickupLocation,
    kind: input.fulfilment.kind,
    deliveryAddress: input.fulfilment.deliveryAddress,
  }
}

export function usePlaceOrder() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => client.invalidateQueries({ queryKey: bookKeys.all }),
  })
}
