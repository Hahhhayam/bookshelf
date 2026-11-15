import { Button, Group, TextInput } from '@mantine/core'
import { useState, type FormEvent } from 'react'
import { tokens } from '@/shared/config/tokens'

export function TrackForm({ initial, onSubmit }: { initial: string; onSubmit: (code: string) => void }) {
  const [code, setCode] = useState(initial)

  function submit(event: FormEvent) {
    event.preventDefault()
    if (code.trim()) onSubmit(code.trim().toUpperCase())
  }

  return (
    <form onSubmit={submit} aria-label="Пошук за кодом">
      <Group gap="sm" align="flex-end" wrap="wrap">
        <TextInput label="Код отримання" size="lg" value={code} onChange={(e) => setCode(e.currentTarget.value)}
          style={{ flex: '1 1 260px' }} autoComplete="off" required
          styles={{ input: { fontFamily: tokens.font.mono, fontSize: 22, letterSpacing: '.08em', height: 52 } }} />
        <Button type="submit" size="lg" h={52}>Перевірити</Button>
      </Group>
    </form>
  )
}
