import { MultiSelect, Select, type ComboboxItem } from '@mantine/core'
import { useState } from 'react'

const createToken = '__create__'

interface CommonProps {
  label?: string
  placeholder?: string
  items: ComboboxItem[]
  error?: string
  required?: boolean
  disabled?: boolean
  /** Shown as «{createLabel} «typed text»» when the typed text matches nothing; omit to turn creating off. */
  createLabel?: string
  onCreate?: (name: string) => Promise<string>
}

function withCreateOption(items: ComboboxItem[], search: string, createLabel?: string, canCreate?: boolean) {
  const name = search.trim()
  const exists = items.some((item) => item.label.toLocaleLowerCase('uk') === name.toLocaleLowerCase('uk'))
  if (!canCreate || !name || exists) return items
  return [...items, { value: createToken, label: `${createLabel ?? 'Створити'} «${name}»` }]
}

/** A searchable select that can create the missing item from what was typed. */
export function CreatableSelect({ value, onChange, clearable, ...props }: CommonProps & {
  value: string | null
  onChange: (value: string | null) => void
  clearable?: boolean
}) {
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)

  async function change(next: string | null) {
    if (next !== createToken) return onChange(next)
    setCreating(true)
    try {
      onChange(await props.onCreate!(search.trim()))
    } catch {
      /* onCreate reports its own error */
    } finally {
      setCreating(false)
    }
  }

  return (
    <Select
      label={props.label} placeholder={props.placeholder} error={props.error} withAsterisk={props.required}
      disabled={props.disabled || creating} clearable={clearable} searchable
      data={withCreateOption(props.items, search, props.createLabel, !!props.onCreate)}
      value={value} onChange={(next) => void change(next)}
      searchValue={search} onSearchChange={setSearch}
      nothingFoundMessage="Нічого не знайдено"
    />
  )
}

export function CreatableMultiSelect({ value, onChange, ...props }: CommonProps & {
  value: string[]
  onChange: (value: string[]) => void
}) {
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)

  async function change(next: string[]) {
    if (!next.includes(createToken)) return onChange(next)
    const kept = next.filter((item) => item !== createToken)
    setCreating(true)
    try {
      const id = await props.onCreate!(search.trim())
      onChange([...kept, id])
      setSearch('')
    } catch {
      /* onCreate reports its own error */
    } finally {
      setCreating(false)
    }
  }

  return (
    <MultiSelect
      label={props.label} placeholder={props.placeholder} error={props.error} withAsterisk={props.required}
      disabled={props.disabled || creating} searchable
      data={withCreateOption(props.items, search, props.createLabel, !!props.onCreate)}
      value={value} onChange={(next) => void change(next)}
      searchValue={search} onSearchChange={setSearch}
      nothingFoundMessage="Нічого не знайдено"
    />
  )
}
