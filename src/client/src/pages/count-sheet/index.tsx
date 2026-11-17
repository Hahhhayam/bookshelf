import { useParams } from 'react-router'
import { useCount } from '@/entities/inventory-count'
import { QueryView } from '@/shared/ui'
import { CountSheet } from './ui/CountSheet'

export default function CountSheetPage() {
  const { id } = useParams()
  const count = useCount(id)
  return <QueryView query={count}>{(data) => <CountSheet count={data} />}</QueryView>
}
