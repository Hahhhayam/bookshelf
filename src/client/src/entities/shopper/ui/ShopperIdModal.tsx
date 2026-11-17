import { TextInput } from '@mantine/core'
import { useState } from 'react'
import { FormModal } from '@/shared/ui'
import { isShopperId, shopper } from '../model/shopper'

interface Props {
  opened: boolean
  onClose: () => void
  onDone?: (id: string) => void
}

/** Asks for the customer number from the card and remembers it in this browser; the cart is kept under it. */
export function ShopperIdModal(props: Props) {
  return props.opened ? <ShopperIdForm {...props} /> : null
}

function ShopperIdForm({ onClose, onDone }: Props) {
  const [value, setValue] = useState(() => shopper.id() ?? '')
  const [error, setError] = useState<string | null>(null)

  function submit() {
    if (!isShopperId(value)) return setError('Введіть номер покупця у форматі xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, як на картці.')
    shopper.set(value)
    onClose()
    onDone?.(value.trim())
  }

  return (
    <FormModal opened title="Номер покупця" submitLabel="Зберегти" error={error} onSubmit={submit} onClose={onClose}>
      <TextInput
        label="Номер покупця"
        description="Введіть номер з картки покупця — ми запам’ятаємо його в цьому браузері. Кошик зберігається за цим номером."
        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        autoComplete="off"
        data-autofocus
        required
      />
    </FormModal>
  )
}
