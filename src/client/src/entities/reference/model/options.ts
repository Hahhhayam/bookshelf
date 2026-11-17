import type { ComboboxItem } from '@mantine/core'
import { shortName } from './queries'

interface Listed {
  id: string
  name: string
  active?: boolean
}

/** Options for a picker: active items, plus the selected ids even when they are inactive. */
export function toOptions(items: readonly Listed[] | undefined, selected: readonly string[]): ComboboxItem[] {
  const list = items ?? []
  const options = list
    .filter((item) => item.active !== false || selected.includes(item.id))
    .map((item) => ({ value: item.id, label: item.active === false ? `${item.name} (неактивний)` : item.name }))
  const missing = selected
    .filter((id) => !list.some((item) => item.id === id))
    .map((id) => ({ value: id, label: shortName(id) }))
  return [...options, ...missing]
}
