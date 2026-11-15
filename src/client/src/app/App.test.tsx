import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { routes } from './router'

const openAt = (url: string) => render(<App router={createMemoryRouter(routes, { initialEntries: [url] })} />)

describe('App', () => {
  beforeEach(() => sessionStorage.clear())

  it('opens the shop at the root', async () => {
    openAt('/')
    expect(await screen.findByRole('heading', { name: 'Каталог' })).toBeInTheDocument()
  })

  it('sends staff without a session to login', async () => {
    openAt('/staff')
    expect(await screen.findByRole('heading', { name: 'Вхід для працівників' })).toBeInTheDocument()
  })
})
