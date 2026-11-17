import { Button, type ButtonProps } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconShoppingBag } from '@tabler/icons-react'
import { useState } from 'react'
import { ShopperIdModal, useShopperId } from '@/entities/shopper'
import { errorMessage } from '@/shared/ui'
import { useAddToCart } from '../model/useAddToCart'

interface Props extends Pick<ButtonProps, 'size' | 'fullWidth' | 'variant' | 'disabled'> {
  book: { id: string; title: string }
  quantity?: number
}

/** «У кошик»: puts the book into the shopper's cart, first asking who is shopping if this browser does not know yet. */
export function AddToCartButton({ book, quantity = 1, variant = 'outline', ...button }: Props) {
  const shopperId = useShopperId()
  const add = useAddToCart()
  const [asking, setAsking] = useState(false)

  function addFor(customer: string) {
    add.mutate({ customer, book: book.id, quantity }, {
      onSuccess: () => notifications.show({ color: 'green', message: `«${book.title}» у кошику` }),
      onError: (error) => notifications.show({ color: 'red', message: errorMessage(error) }),
    })
  }

  return (
    <>
      <Button variant={variant} leftSection={<IconShoppingBag size={18} stroke={1.75} />} loading={add.isPending}
        onClick={() => (shopperId ? addFor(shopperId) : setAsking(true))} {...button}>
        У кошик
      </Button>
      <ShopperIdModal opened={asking} onClose={() => setAsking(false)} onDone={addFor} />
    </>
  )
}
