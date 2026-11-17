import { Anchor, AppShell, Badge, Button, Container, Group, TextInput } from '@mantine/core'
import { IconGift, IconSearch, IconShoppingCart, IconTruck } from '@tabler/icons-react'
import { useState, type FormEvent } from 'react'
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router'
import { cartCount, useCart } from '@/entities/cart'
import { useShopperId } from '@/entities/shopper'
import { tokens } from '@/shared/config/tokens'
import { Brand } from '@/shared/ui'

/** The online shop: brand, search, order tracking, the buyer's bonuses and the cart. */
export function ShopShell() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [text, setText] = useState(params.get('q') ?? '')
  const count = cartCount(useCart(useShopperId()).data?.lines ?? [])

  function search(event: FormEvent) {
    event.preventDefault()
    navigate(text.trim() ? `/?q=${encodeURIComponent(text.trim())}` : '/')
  }

  return (
    <AppShell header={{ height: 72 }} styles={{ header: { borderColor: tokens.color.line }, main: { background: tokens.color.paper } }}>
      <AppShell.Header>
        <Container size={1280} h="100%">
          <Group h="100%" justify="space-between" wrap="nowrap" gap="lg">
            <Anchor component={Link} to="/" underline="never" aria-label="Полиця, на головну"><Brand size={30} /></Anchor>
            <form onSubmit={search} style={{ flex: 1, maxWidth: 560 }} role="search">
              <TextInput size="lg" aria-label="Пошук книг" placeholder="Назва, автор або ISBN" value={text}
                onChange={(e) => setText(e.currentTarget.value)} leftSection={<IconSearch size={18} />} />
            </form>
            <Group gap="xs" wrap="nowrap">
              <Button component={Link} to="/track" variant="subtle" leftSection={<IconTruck size={18} />} visibleFrom="sm">
                Відстежити
              </Button>
              <Button component={Link} to="/bonuses" variant="subtle" leftSection={<IconGift size={18} />} visibleFrom="sm">
                Бонуси
              </Button>
              <Button component={Link} to="/cart" variant="default" leftSection={<IconShoppingCart size={18} />}
                rightSection={count > 0 ? <Badge size="sm" circle={false}>{count}</Badge> : undefined}>
                Кошик
              </Button>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size={1280} py="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
