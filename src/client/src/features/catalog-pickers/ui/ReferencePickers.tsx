import { toOptions, useCreateReference, useReferenceList, type CatalogReferenceKind } from '@/entities/reference'
import { CreatableMultiSelect, CreatableSelect } from '@/shared/ui'

interface PickerProps {
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  /** Lets the user add the typed name as a new item (needs catalog.edit). */
  creatable?: boolean
}

interface SingleProps extends PickerProps {
  value: string | null
  onChange: (value: string | null) => void
  clearable?: boolean
}

interface MultiProps extends PickerProps {
  value: string[]
  onChange: (value: string[]) => void
}

const createLabel: Record<CatalogReferenceKind, string> = {
  authors: 'Створити нового автора',
  publishers: 'Створити видавництво',
  categories: 'Створити категорію',
}

function useSource(kind: CatalogReferenceKind, selected: string[], creatable?: boolean) {
  const list = useReferenceList(kind)
  const create = useCreateReference(kind)
  return {
    items: toOptions(list.data, selected),
    createLabel: createLabel[kind],
    onCreate: creatable ? (name: string) => create.mutateAsync(name) : undefined,
  }
}

function SinglePicker({ kind, value, creatable, ...props }: SingleProps & { kind: CatalogReferenceKind }) {
  const source = useSource(kind, value ? [value] : [], creatable)
  return <CreatableSelect {...props} {...source} value={value} />
}

export function CategoryPicker({ label = 'Категорія', ...props }: SingleProps) {
  return <SinglePicker kind="categories" label={label} placeholder="Оберіть або введіть назву" {...props} />
}

export function PublisherPicker({ label = 'Видавництво', ...props }: SingleProps) {
  return <SinglePicker kind="publishers" label={label} placeholder="Оберіть або введіть назву" {...props} />
}

/** One author, as a search filter. */
export function AuthorPicker({ label = 'Автор', ...props }: SingleProps) {
  return <SinglePicker kind="authors" label={label} placeholder="Будь-який" {...props} />
}

/** Several authors, as the book form takes them. */
export function AuthorsPicker({ label = 'Автори', value, creatable, ...props }: MultiProps) {
  const source = useSource('authors', value, creatable)
  return <CreatableMultiSelect label={label} placeholder="Почніть вводити ім’я" {...props} {...source} value={value} />
}
