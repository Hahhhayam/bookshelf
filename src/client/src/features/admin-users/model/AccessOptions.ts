export interface Option {
  value: string
  label: string
}

/** What roles and locations can be granted; the page builds them, since lists come from several entities. */
export interface AccessOptions {
  roles: Option[]
  locations: Option[]
}

export const labelOf = (options: Option[], value: string) =>
  options.find((option) => option.value === value)?.label ?? `#${value.slice(0, 8)}`
