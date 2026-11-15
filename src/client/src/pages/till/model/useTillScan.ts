import { useState } from 'react'
import type { BookHit } from '@/entities/book'
import { referenceName } from '@/entities/reference'
import { availableAt, elsewhere, type ReceiptLine } from '@/features/till-receipt'
import { useBookLookup, type ScanMessage } from '@/features/till-scan'
import { formatMoney } from '@/shared/lib'
import { errorMessage } from '@/shared/ui'

function notEnough(hit: BookHit, inReceipt: number, here: number, locationId: string): ScanMessage {
  const others = elsewhere(hit, locationId).map((a) => `${referenceName('locations', a.location)} — ${a.available} шт.`)
  return {
    tone: 'error',
    title: 'Недостатньо товару',
    text: `«${hit.title}» уже ${inReceipt} шт. у чеку, а в магазині за обліком лише ${here}. Більше додати не можна.`,
    extra: others.length > 0 ? `Є в мережі: ${others.join(', ')}.` : undefined,
  }
}

/** A scan: one book is added, several open a pick list, none says so; stock is checked against the search result. */
export function useTillScan(locationId: string, lines: ReceiptLine[], add: (line: Omit<ReceiptLine, 'quantity'>) => void) {
  const lookup = useBookLookup()
  const [message, setMessage] = useState<ScanMessage | null>(null)
  const [pick, setPick] = useState<{ hits: BookHit[]; code: string } | null>(null)

  function addHit(hit: BookHit) {
    setPick(null)
    const inReceipt = lines.find((l) => l.book === hit.id)?.quantity ?? 0
    const here = availableAt(hit, locationId)
    if (here !== undefined && inReceipt + 1 > here) return setMessage(notEnough(hit, inReceipt, here, locationId))
    add({ book: hit.id, title: hit.title, unitPrice: hit.price })
    setMessage({ tone: 'ok', text: `Додано: «${hit.title}» · ${formatMoney(hit.price)}` })
  }

  function scan(code: string) {
    lookup.mutate(code, {
      onSuccess: (hits) => {
        if (hits.length === 1) return addHit(hits[0]!)
        if (hits.length > 1) return setPick({ hits, code })
        setMessage({ tone: 'error', title: 'Книгу не знайдено', text: `За кодом «${code}» нічого немає. Перевірте код або знайдіть за назвою (F2).` })
      },
      onError: (error) => setMessage({ tone: 'error', title: 'Не вдалося знайти книгу', text: errorMessage(error) }),
    })
  }

  return { scan, addHit, busy: lookup.isPending, message, setMessage, pick, closePick: () => setPick(null) }
}
