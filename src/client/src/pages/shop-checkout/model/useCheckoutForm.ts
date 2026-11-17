import { useState } from 'react'
import type { FulfilmentKind } from '@/entities/order'
import { useMyStore } from '@/features/shop-my-store'
import type { PlaceOrderInput, StoreCoverage } from '@/features/shop-place-order'

type Built = { input: PlaceOrderInput; error?: undefined } | { input?: undefined; error: string }

/** The checkout choices and the order they make; stock always comes from one store that has every book. */
export function useCheckoutForm(customer: string, stores: readonly StoreCoverage[]) {
  const store = useMyStore()
  const [kind, setKind] = useState<FulfilmentKind>('Pickup')
  const [pickup, setPickup] = useState<string | null>(null)
  const [address, setAddress] = useState('')

  const covering = stores.filter((s) => s.missing.length === 0)
  const pickupStore = pickup ?? covering.find((s) => s.location === store)?.location ?? covering[0]?.location ?? null
  const deliveryStock = covering[0]?.location ?? null

  function build(): Built {
    return kind === 'Pickup' ? buildPickup() : buildDelivery()
  }

  function buildPickup(): Built {
    if (!pickupStore) return { error: 'Жоден магазин не має всіх книжок разом. Приберіть відсутні або оберіть доставку.' }
    return { input: { customer, stockLocation: pickupStore, fulfilment: { kind, pickupLocation: pickupStore, deliveryAddress: null } } }
  }

  function buildDelivery(): Built {
    if (!address.trim()) return { error: 'Вкажіть адресу доставки.' }
    if (!deliveryStock) return { error: 'Немає магазину, де є всі книжки разом, тож доставити одним відправленням не вийде.' }
    return { input: { customer, stockLocation: deliveryStock, fulfilment: { kind, pickupLocation: null, deliveryAddress: address.trim() } } }
  }

  return { kind, setKind, pickupStore, setPickup, address, setAddress, deliveryStock, build }
}

export type CheckoutForm = ReturnType<typeof useCheckoutForm>
