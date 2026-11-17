import { Anchor, Box, Breadcrumbs, Flex, Stack, Text } from '@mantine/core'
import { Link, useParams } from 'react-router'
import { BookCover, useBookCard, type BookCard } from '@/entities/book'
import { useReferenceNames } from '@/entities/reference'
import { tokens } from '@/shared/config/tokens'
import { QueryView } from '@/shared/ui'
import { BookDetails } from './ui/BookDetails'
import { BookSummary } from './ui/BookSummary'

/** Book page (artboards ShopBook, ShopMobile b): live availability, so «У кошик» is decided on fresh data. */
export default function ShopBookPage() {
  const { id } = useParams()
  const card = useBookCard(id)
  return <QueryView query={card}>{(book) => <BookView book={book} />}</QueryView>
}

function BookView({ book }: { book: BookCard }) {
  const authorName = useReferenceNames('authors')
  const authors = book.authors.map((author) => authorName(author)).join(', ')
  return (
    <Stack gap="lg">
      <Breadcrumbs separator="/" fz="md">
        <Anchor component={Link} to="/">Каталог</Anchor>
        <Text c={tokens.color.ink2}>{book.title}</Text>
      </Breadcrumbs>
      <Flex gap={{ base: 'lg', md: 48 }} direction={{ base: 'column', sm: 'row' }} align="flex-start">
        <div style={{ width: '100%', maxWidth: 360, flex: 'none' }}>
          <BookCover id={book.id} title={book.title} caption={authors} size="lg" />
        </div>
        <BookSummary book={book} authors={authors} />
      </Flex>
      <Box pt="lg" style={{ borderTop: `1px solid ${tokens.color.line}` }}>
        <BookDetails book={book} />
      </Box>
    </Stack>
  )
}
