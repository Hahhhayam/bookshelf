const rules = new Intl.PluralRules('uk-UA')

const forms: Record<string, string> = { one: 'книжка', few: 'книжки', many: 'книжок', other: 'книжки' }

/** «1 книжка», «3 книжки», «14 книжок». */
export function pluralBooks(count: number): string {
  return `${count} ${forms[rules.select(count)] ?? forms.many}`
}
