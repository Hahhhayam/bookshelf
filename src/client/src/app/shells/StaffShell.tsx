import { AppShell, Button, Group, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { logout } from '../../auth/logout'
import { session } from '../../auth/session'

/** Staff area: anyone without a session is sent to login, which brings them back here afterwards. */
export function StaffShell() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  if (!session.token()) return <Navigate to="/staff/login" replace state={{ from: location.pathname }} />

  return (
    <AppShell header={{ height: 56 }} navbar={{ width: 240, breakpoint: 'sm' }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={4}>{t('staff.title')}</Title>
          <Button variant="subtle" onClick={async () => { await logout(); navigate('/staff/login') }}>
            {t('staff.logout')}
          </Button>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">{/* Navigation built from the user's permissions (needs GET /auth/me). */}</AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
