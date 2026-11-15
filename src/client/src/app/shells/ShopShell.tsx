import { Anchor, AppShell, Group, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router'

export function ShopShell() {
  const { t } = useTranslation()
  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Anchor component={Link} to="/" underline="never" c="inherit">
            <Title order={3}>{t('shop.title')}</Title>
          </Anchor>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
