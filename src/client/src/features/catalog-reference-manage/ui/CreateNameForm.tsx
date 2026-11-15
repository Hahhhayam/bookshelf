import { Button, Group, TextInput } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useState, type FormEvent } from 'react'

/** One name field and an add button; clears itself after a successful create. */
export function CreateNameForm({ label, placeholder, loading, onCreate }: {
  label: string
  placeholder?: string
  loading?: boolean
  onCreate: (name: string) => Promise<unknown>
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return setError('Вкажіть назву')
    try {
      await onCreate(name)
      setName('')
    } catch {
      /* the mutation reports the error */
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)}>
      <Group align="flex-start" gap="sm" wrap="wrap">
        <TextInput label={label} placeholder={placeholder} value={name} error={error} style={{ flex: '1 1 240px' }}
          onChange={(e) => { setName(e.currentTarget.value); setError(null) }} />
        <Button type="submit" loading={loading} leftSection={<IconPlus size={16} />} mt={25}>Додати</Button>
      </Group>
    </form>
  )
}
