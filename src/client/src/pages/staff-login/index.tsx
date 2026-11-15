import { Center, Paper } from '@mantine/core'
import { useLocation, useNavigate } from 'react-router'
import { LoginForm } from '@/features/auth'
import { tokens } from '@/shared/config/tokens'

/** One login page for every role; after it the menu is built from the user's rights (artboard Login). */
export default function StaffLoginPage() {
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/staff'
  return (
    <Center mih="100vh" p="lg" style={{ background: tokens.color.paper }}>
      <Paper withBorder shadow="xs" p={36} w={400} maw="100%">
        <LoginForm onSuccess={() => navigate(from, { replace: true })} />
      </Paper>
    </Center>
  )
}
