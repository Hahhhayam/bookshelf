import { Alert, Button } from '@mantine/core'
import { IconAlertCircle, IconLock, IconWifiOff } from '@tabler/icons-react'
import { ApiError } from '@/shared/api'

function describe(error: unknown): { title: string; text: string; icon: typeof IconLock } {
  if (error instanceof ApiError) {
    if (error.status === 403) return { title: 'Немає прав на цю дію', text: 'Зверніться до адміністратора, якщо вони потрібні для роботи.', icon: IconLock }
    if (error.status === 404) return { title: 'Не знайдено', text: 'Можливо, запис видалено або посилання застаріле.', icon: IconAlertCircle }
    return { title: 'Не вдалося виконати', text: error.message, icon: IconAlertCircle }
  }
  return { title: 'Немає з’єднання з сервером', text: 'Перевірте мережу і спробуйте ще раз.', icon: IconWifiOff }
}

/** Shows a failed call in plain words; a business-rule refusal (422) carries the server's own message. */
export function ErrorView({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { title, text, icon: Icon } = describe(error)
  return (
    <Alert color="red" variant="light" icon={<Icon size={18} stroke={1.75} />} title={title}>
      {text}
      {onRetry && <div><Button variant="subtle" size="xs" mt="xs" onClick={onRetry}>Спробувати ще раз</Button></div>}
    </Alert>
  )
}

/** The message to show next to a form for a refused command: a broken business rule (422) speaks for itself. */
export function errorMessage(error: unknown): string {
  return error instanceof ApiError && error.status === 422 ? error.message : describe(error).title
}
