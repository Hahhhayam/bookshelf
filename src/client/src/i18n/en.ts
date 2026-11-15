import type { uk } from './uk'

export const en: typeof uk = {
  shop: { title: 'Bookstore', catalog: 'Catalog' },
  staff: { title: 'Workspace', logout: 'Log out', home: 'Pick an area in the menu' },
  login: {
    title: 'Staff login',
    login: 'Login',
    password: 'Password',
    submit: 'Log in',
    invalid: 'Invalid login or password',
    blocked: 'The account is blocked',
  },
  notFound: { title: 'Page not found', back: 'Back to the start' },
}
