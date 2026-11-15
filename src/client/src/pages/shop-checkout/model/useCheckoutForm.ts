import { useState } from 'react'
import type { CartLine } from '@/entities/cart'
import type { FulfilmentKind } from '@/entities/order'
import { useShopperId } from '@/entities/shopper'
import { useMyStore } from '@/features/shop-my-store'
import type { PlaceOrderInput, StoreCoverage } from '@/features/shop-place-order'

const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type Built = { input: PlaceOrderInput; error?: undefined } | { input?: undefined; error: string }

/** The checkout choices and the order they make; stock always comes from one location that has every book. */
export function useCheckoutForm(lines: readonly CartLine[], stores: readonly StoreCoverage[]) {
  const shopperId = useShopperId()
  const store = useMyStore()
  const [kind, setKind] = useState<FulfilmentKind>('Pickup')
  const [pickup, setPickup] = useState<string | null>(null)
  const [address, setAddress] = useState('')
  const [editingCustomer, setEditingCustomer] = useState(false)
  const [customer, setCustomer] = useState('')

  const covering = stores.filter((s) => s.missing.length === 0)
  const pickupStore = pickup ?? covering.find((s) => s.location === store)?.location ?? covering[0]?.location ?? null
  const deliveryStock = covering[0]?.location ?? null
  const askCustomer = !shopperId || editingCustomer
  const customerId = askCustomer ? customer.trim() : shopperId

  function build(): Built {
    if (!customerId || !guid.test(customerId)) return { error: 'Введіть номер покупця у форматі xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, як на картці.' }
    if (kind === 'Pickup') return buildPickup(customerId)
    return buildDelivery(customerId)
  }

  function buildPickup(id: string): Built {
    if (!pickupStore) return { error: 'Жоден магазин не має всіх книжок разом. Приберіть відсутні або оберіть доставку.' }
    return { input: { customer: id, lines, stockLocation: pickupStore, fulfilment: { kind, pickupLocation: pickupStore, deliveryAddress: null } } }
  }

  function buildDelivery(id: string): Built {
    if (!address.trim()) return { error: 'Вкажіть адресу доставки.' }
    if (!deliveryStock) return { error: 'Немає магазину, де є всі книжки разом, тож доставити одним відправленням не вийде.' }
    return { input: { customer: id, lines, stockLocation: deliveryStock, fulfilment: { kind, pickupLocation: null, deliveryAddress: address.trim() } } }
  }

  return {
    kind, setKind, pickupStore, setPickup, address, setAddress, deliveryStock,
    shopperId, askCustomer, customer, setCustomer, editCustomer: () => { setCustomer(shopperId ?? ''); setEditingCustomer(true) },
    customerId, build,
  }
}

export type CheckoutForm = ReturnType<typeof useCheckoutForm>
