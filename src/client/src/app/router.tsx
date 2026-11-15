import { createBrowserRouter, type RouteObject } from 'react-router'
import { LoginPage } from '../auth/LoginPage'
import { NotFoundPage } from '../components/NotFoundPage'
import { CatalogPage } from '../features/shop/CatalogPage'
import { StaffHomePage } from '../features/staff/StaffHomePage'
import { ShopShell } from './shells/ShopShell'
import { StaffShell } from './shells/StaffShell'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ShopShell />,
    children: [{ index: true, element: <CatalogPage /> }],
  },
  { path: '/staff/login', element: <LoginPage /> },
  {
    path: '/staff',
    element: <StaffShell />,
    children: [{ index: true, element: <StaffHomePage /> }],
  },
  { path: '*', element: <NotFoundPage /> },
]

export const browserRouter = createBrowserRouter(routes)
