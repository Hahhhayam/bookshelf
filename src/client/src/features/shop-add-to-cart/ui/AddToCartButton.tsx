import { Button, type ButtonProps } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconShoppingBag } from '@tabler/icons-react'
import type { Money } from '@/shared/api'
import { cart } from '@/entities/cart'

interface Props extends Pick<ButtonProps, 'size' | 'fullWidth' | 'variant' | 'disabled'> {
  book: { id: string; title: string; price: Money }
  quantity?: number
}

/** «У кошик»: puts the book into the browser cart (GAP-01) and says so. */
export function AddToCartButton({ book, quantity = 1, variant = 'outline', ...button }: Props) {
  function add() {
    cart.add({ book: book.id, title: book.title, price: book.price }, quantity)
    notifications.show({ color: 'green', message: `«${book.title}» у кошику` })
  }

  return (
    <Button variant={variant} leftSection={<IconShoppingBag size={18} stroke={1.75} />} onClick={add} {...button}>
      У кошик
    </Button>
  )
}
