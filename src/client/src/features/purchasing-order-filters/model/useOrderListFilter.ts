import { useSearchParams } from 'react-router'
import { defaultOrderFilter, type OrderListFilter, type StatusFilter } from './filter'

/** The list's filters live in the address, so a link or "back" keeps them. */
export function useOrderListFilter() {
  const [params, setParams] = useSearchParams()
  const filter: OrderListFilter = {
    status: (params.get('status') as StatusFilter | null) ?? defaultOrderFilter.status,
    overdue: params.get('overdue') === '1',
    supplier: params.get('supplier'),
  }

  function change(patch: Partial<OrderListFilter>) {
    const next = { ...filter, ...patch }
    const search = new URLSearchParams()
    if (next.status !== defaultOrderFilter.status) search.set('status', next.status)
    if (next.overdue) search.set('overdue', '1')
    if (next.supplier) search.set('supplier', next.supplier)
    setParams(search, { replace: true })
  }

  return { filter, change, reset: () => setParams(new URLSearchParams(), { replace: true }) }
}
