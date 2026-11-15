import { Alert, Button, Center, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import { session } from './session'

/** Scenario 3.1. Placeholder form until the login screen from the design is built. */
export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/staff'
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: form.get('login'), password: form.get('password') }),
    })
    if (!response.ok) return setError(t(response.status === 403 ? 'login.blocked' : 'login.invalid'))
    session.start(((await response.json()) as { token: string }).token)
    navigate(from, { replace: true })
  }

  return (
    <Center h="100vh">
      <Paper withBorder p="xl" w={360} component="form" onSubmit={submit}>
        <Stack>
          <Title order={3}>{t('login.title')}</Title>
          {error && <Alert color="red">{error}</Alert>}
          <TextInput name="login" label={t('login.login')} required autoFocus />
          <PasswordInput name="password" label={t('login.password')} required />
          <Button type="submit">{t('login.submit')}</Button>
        </Stack>
      </Paper>
    </Center>
  )
}
