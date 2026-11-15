import createClient, { type Middleware } from 'openapi-fetch'
import { session } from '../auth/session'
import type { paths } from './schema'

/** Sends the session token and, when the server no longer accepts it, ends the session and goes to login. */
const auth: Middleware = {
  onRequest({ request }) {
    const token = session.token()
    if (token) request.headers.set('Authorization', `Bearer ${token}`)
    return request
  },
  onResponse({ response }) {
    if (response.status === 401 && session.token()) {
      session.end()
      window.location.assign('/staff/login')
    }
    return response
  },
}

/** Typed client generated from the API's OpenAPI document (`npm run api:generate`). */
export const api = createClient<paths>({ baseUrl: '/api' })
api.use(auth)
