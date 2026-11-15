import { AppShell, Burger, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet } from 'react-router'
import { LocationSwitcher } from '@/features/switch-location'
import { tokens } from '@/shared/config/tokens'
import { Brand } from '@/shared/ui'
import type { NavGroup } from '../model/types'
import { OfflineBanner } from './OfflineBanner'
import { StaffNav } from './StaffNav'
import { UserMenu } from './UserMenu'

/** The staff workspace: menu by rights, the working location, the user, and the page. */
export function StaffShell({ navigation }: { navigation: NavGroup[] }) {
  const [opened, { toggle, close }] = useDisclosure()
  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 248, breakpoint: 'md', collapsed: { mobile: !opened } }}
      padding="lg"
      styles={{
        header: { background: tokens.color.surface, borderColor: tokens.color.line },
        navbar: { background: tokens.color.side, borderColor: tokens.color.line },
        main: { background: tokens.color.paper },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between" wrap="nowrap">
          <Group gap="md" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" aria-label="Меню" />
            <Brand size={26} />
            <LocationSwitcher />
          </Group>
          <UserMenu />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        <StaffNav navigation={navigation} onNavigate={close} />
      </AppShell.Navbar>
      <AppShell.Main>
        <OfflineBanner />
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Outlet />
        </div>
      </AppShell.Main>
    </AppShell>
  )
}
