import { session } from './session'

/** Revokes the session on the server too, so a copied token stops working. */
export async function logout() {
  const token = session.token()
  try {
    if (token) await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
  } finally {
    session.end()
  }
}
