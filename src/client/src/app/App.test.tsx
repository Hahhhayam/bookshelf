import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { routes } from './routing/router'

const openAt = (url: string) => render(<App router={createMemoryRouter(routes, { initialEntries: [url] })} />)

describe('App', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('opens the shop at the root', async () => {
    openAt('/')
    expect(await screen.findByRole('search')).toBeInTheDocument()
  })

  it('sends staff without a session to login', async () => {
    openAt('/staff/orders')
    expect(await screen.findByRole('button', { name: 'Увійти' })).toBeInTheDocument()
  })

  it('shows the not-found page for an unknown address', async () => {
    openAt('/no-such-page')
    expect(await screen.findByText('Сторінку не знайдено')).toBeInTheDocument()
  })
})
