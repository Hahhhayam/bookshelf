import { useSearchParams } from 'react-router'
import { CatalogSearch } from './ui/CatalogSearch'
import { CatalogStart } from './ui/CatalogStart'
import type { Facets } from './ui/FacetFilter'

/** Shop catalog (artboards ShopCatalog, ShopMobile a): search results for ?q=, category, publisher and «my store». */
export default function ShopCatalogPage() {
  const [params, setParams] = useSearchParams()
  const text = params.get('q')?.trim() ?? ''
  const onlyMyStore = params.get('mine') === '1'
  const facets: Facets = { category: params.get('cat'), publisher: params.get('pub') }

  function setParam(name: string, value: string | null) {
    const next = new URLSearchParams(params)
    if (value) next.set(name, value)
    else next.delete(name)
    setParams(next, { replace: true })
  }

  function setFacets(next: Facets) {
    const updated = new URLSearchParams(params)
    for (const [name, value] of [['cat', next.category], ['pub', next.publisher]] as const) {
      if (value) updated.set(name, value)
      else updated.delete(name)
    }
    setParams(updated, { replace: true })
  }

  if (!text && !facets.category && !facets.publisher) return <CatalogStart onFacetsChange={setFacets} />
  return (
    <CatalogSearch text={text} facets={facets} onFacetsChange={setFacets} onlyMyStore={onlyMyStore}
      onOnlyMyStoreChange={(on) => setParam('mine', on ? '1' : null)} />
  )
}
