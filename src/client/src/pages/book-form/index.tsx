import { useParams } from 'react-router'
import { AddBook } from './ui/AddBook'
import { EditBook } from './ui/EditBook'

/** Scenarios 3.2–3.4 (artboards BookForm, FormDialogs): one page for adding and editing; an id means edit. */
export default function BookFormPage() {
  const { id } = useParams()
  return id ? <EditBook id={id} /> : <AddBook />
}
