import { Alert, Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { IconAlertCircle, IconLock } from '@tabler/icons-react'
import { useRef, useState, type FormEvent } from 'react'
import { ApiError } from '@/shared/api'
import { Brand } from '@/shared/ui'
import { useLogin } from '../model/useLogin'

/** Scenario 3.1 (artboard Login): normal, wrong credentials, and a blocked account. */
export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const login = useLogin()
  const passwordRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const blocked = login.error instanceof ApiError && login.error.status === 403

  function submit(event: FormEvent) {
    event.preventDefault()
    login.mutate({ login: user, password }, {
      onSuccess,
      onError: () => { setPassword(''); passwordRef.current?.focus() },
    })
  }

  return (
    <form onSubmit={submit} aria-label="Вхід">
      <Stack gap="lg">
        <Brand size={32} />
        <Stack gap={4}>
          <Text fw={700} fz={20}>Увійдіть, щоб почати зміну</Text>
          <Text size="md" c="dimmed">Логін і пароль видає адміністратор магазину</Text>
        </Stack>
        {login.isError && !blocked && (
          <Alert color="red" icon={<IconAlertCircle size={18} />} title="Невірний логін або пароль">
            Перевірте розкладку клавіатури та Caps Lock.
          </Alert>
        )}
        {blocked && (
          <Alert color="orange" icon={<IconLock size={18} />} title="Обліковий запис заблоковано">
            Вхід для <strong>{user}</strong> закрито. Зверніться до системного адміністратора.
          </Alert>
        )}
        <TextInput label="Логін" autoComplete="username" required autoFocus value={user}
          onChange={(e) => setUser(e.currentTarget.value)} error={login.isError && !blocked} disabled={blocked} />
        <PasswordInput ref={passwordRef} label="Пароль" autoComplete="current-password" required value={password}
          onChange={(e) => setPassword(e.currentTarget.value)} error={login.isError && !blocked} disabled={blocked} />
        <Button type="submit" size="lg" loading={login.isPending} disabled={blocked}>Увійти</Button>
        <Text size="sm" c="dimmed">Забули пароль? Зверніться до адміністратора свого магазину.</Text>
      </Stack>
    </form>
  )
}
