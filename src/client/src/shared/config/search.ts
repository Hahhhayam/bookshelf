/** Typing in a search box searches by itself once the text is long enough and the user pauses. */
export const searchMinChars = 3
export const searchDebounceMs = 500
export const searchHint = `Введіть щонайменше ${searchMinChars} символи для пошуку`

export const isSearchable = (text: string) => text.trim().length >= searchMinChars
export const isTooShort = (text: string) => text.trim().length > 0 && !isSearchable(text)
