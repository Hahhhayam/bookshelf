import type { ComboboxItem } from '@mantine/core'
import { referenceName, type ReferenceKind } from '@/entities/reference'

interface Listed {
  id: string
  name: string
  active?: boolean
}

/**
 * Options for a picker: active remembered items, plus the selected ids even when they are inactive or were never
 * remembered here (a book created elsewhere still shows its category, as a short id: GAP-03).
 */
export function toOptions(kind: ReferenceKind, items: readonly Listed[] | undefined, selected: readonly string[]): ComboboxItem[] {
  const list = items ?? []
  const options = list
    .filter((item) => item.active !== false || selected.includes(item.id))
    .map((item) => ({ value: item.id, label: item.active === false ? `${item.name} (неактивний)` : item.name }))
  const missing = selected
    .filter((id) => !list.some((item) => item.id === id))
    .map((id) => ({ value: id, label: referenceName(kind, id) }))
  return [...options, ...missing]
}
