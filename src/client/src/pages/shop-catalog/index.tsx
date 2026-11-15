import { useSearchParams } from 'react-router'
import { CatalogSearch } from './ui/CatalogSearch'
import { CatalogStart } from './ui/CatalogStart'

/** Shop catalog (artboards ShopCatalog, ShopMobile a): search results for ?q= with the «my store» filter. */
export default function ShopCatalogPage() {
  const [params, setParams] = useSearchParams()
  const text = params.get('q')?.trim() ?? ''
  const onlyMyStore = params.get('mine') === '1'

  function setOnlyMyStore(on: boolean) {
    const next = new URLSearchParams(params)
    if (on) next.set('mine', '1')
    else next.delete('mine')
    setParams(next, { replace: true })
  }

  if (!text) return <CatalogStart />
  return <CatalogSearch text={text} onlyMyStore={onlyMyStore} onOnlyMyStoreChange={setOnlyMyStore} />
}
