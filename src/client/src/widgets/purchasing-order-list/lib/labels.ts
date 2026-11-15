import { referenceName } from '@/entities/reference'
import { useViewer } from '@/entities/viewer'
import { initials, shortId } from '@/shared/lib'

/** The API gives a purchase order no number of its own (GAP-36); its id's first block stands in. */
export function purchaseOrderNumber(id: string): string {
  return `ЗП-${shortId(id)}`
}

/** Whole days past the expected date, for «Прострочено на N днів». */
export function overdueDays(expectedDate: string, now = new Date()): number {
  const expected = new Date(`${expectedDate.slice(0, 10)}T00:00:00`)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(0, Math.round((today.getTime() - expected.getTime()) / 86_400_000))
}

export function overdueText(expectedDate: string): string {
  const days = overdueDays(expectedDate)
  return `Прострочено на ${days} ${dayWord(days)}`
}

function dayWord(n: number): string {
  const tens = n % 100
  const ones = n % 10
  if (tens >= 11 && tens <= 14) return 'днів'
  if (ones === 1) return 'день'
  if (ones >= 2 && ones <= 4) return 'дні'
  return 'днів'
}

/**
 * A readable name for a user id: the viewer's own login, a user remembered here, else a short id (GAP-04).
 */
export function useUserLabel(): (id: string | null | undefined) => string {
  const viewer = useViewer().data
  return (id) => {
    if (!id) return '—'
    if (viewer && viewer.id === id) return viewer.login
    return referenceName('users', id)
  }
}

/** Initials for the avatar; a short id «#1a2b3c4d» gives its first two characters. */
export function labelInitials(label: string): string {
  return label.startsWith('#') ? label.slice(1, 3).toUpperCase() : initials(label)
}
