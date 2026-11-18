import { TextInput } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { customerApi } from '@/entities/customer'
import { ApiError } from '@/shared/api'
import { errorMessage, FormModal } from '@/shared/ui'
import { isShopperId, shopper } from '../model/shopper'

function lookupError(error: unknown) {
  return error instanceof ApiError && error.status === 404 ? 'Покупця з таким номером не знайдено.' : errorMessage(error)
}

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
  const check = useMutation({ mutationFn: (id: string) => customerApi.bonuses(id) })

  /** The number is kept only when the server knows the customer; otherwise the previous shopper stays. */
  function submit() {
    if (!isShopperId(value)) return setError('Введіть номер покупця у форматі xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, як на картці.')
    const id = value.trim()
    check.mutate(id, {
      onSuccess: () => { shopper.set(id); onClose(); onDone?.(id) },
      onError: (failure) => setError(lookupError(failure)),
    })
  }

  return (
    <FormModal opened title="Номер покупця" submitLabel="Зберегти" error={error} loading={check.isPending}
      onSubmit={submit} onClose={onClose}>
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
