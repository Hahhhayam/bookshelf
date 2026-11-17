import { useState } from 'react'
import { local, readJson, writeJson } from '@/shared/lib'

/** The figures a manager can choose to see (scenario 3.12 step 2). */
export type Figure =
  | 'revenue' | 'margin' | 'receipts' | 'averageCheck' | 'daysOfStock'
  | 'stores' | 'categories' | 'topBooks' | 'abc' | 'shortages' | 'slowMoving'

export const figureOptions: { value: Figure; label: string }[] = [
  { value: 'revenue', label: 'Виручка' },
  { value: 'margin', label: 'Маржа' },
  { value: 'receipts', label: 'Чеки' },
  { value: 'averageCheck', label: 'Середній чек' },
  { value: 'daysOfStock', label: 'Днів запасу' },
  { value: 'stores', label: 'Магазини' },
  { value: 'categories', label: 'Категорії' },
  { value: 'topBooks', label: 'Топ книжок' },
  { value: 'abc', label: 'ABC-аналіз' },
  { value: 'shortages', label: 'Закінчуються' },
  { value: 'slowMoving', label: 'Не продаються' },
]

const key = 'bookshelf.reports.figures'
const all = figureOptions.map((option) => option.value)

/** The chosen figures; kept per browser as a convenience, all of them by default. */
export function useFigures() {
  const [figures, setState] = useState<Figure[]>(() => readJson<Figure[]>(local, key, all))
  const setFigures = (next: Figure[]) => {
    setState(next)
    writeJson(local, key, next)
  }
  return { figures, setFigures, shown: (figure: Figure) => figures.includes(figure) }
}

export type FigureState = ReturnType<typeof useFigures>
