/** A refused call: the HTTP status and the server's problem-details message. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type Query = Record<string, string | number | boolean | readonly (string | number)[] | null | undefined>

export interface RequestOptions {
  query?: Query
  body?: unknown
  headers?: Record<string, string>
}

/**
 * The HTTP layer knows nothing about sessions: the app tells it how to get the token and what to do when the
 * server stops accepting it (dependency inversion), so shared code never imports the viewer entity.
 */
interface HttpConfig {
  baseUrl: string
  getToken: () => string | null
  onUnauthorized: () => void
}

const config: HttpConfig = { baseUrl: '/api', getToken: () => null, onUnauthorized: () => {} }

export function configureHttp(next: Partial<HttpConfig>) {
  Object.assign(config, next)
}

function buildUrl(path: string, query?: Query) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === null || value === undefined || value === '') continue
    if (Array.isArray(value)) value.forEach((v) => params.append(key, String(v)))
    else params.append(key, String(value))
  }
  const search = params.toString()
  return `${config.baseUrl}/${path.replace(/^\//, '')}${search ? `?${search}` : ''}`
}

async function send(method: string, path: string, options: RequestOptions = {}): Promise<Response> {
  const headers: Record<string, string> = { ...options.headers }
  const token = config.getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'

  const response = await fetch(buildUrl(path, options.query), {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
  if (response.ok) return response
  if (response.status === 401 && token) config.onUnauthorized()
  throw new ApiError(response.status, await problemMessage(response))
}

async function problemMessage(response: Response) {
  try {
    const problem = (await response.json()) as { detail?: string; title?: string }
    return problem.detail ?? problem.title ?? response.statusText
  } catch {
    return response.statusText
  }
}

async function json<T>(response: Response): Promise<T> {
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const http = {
  get: async <T>(path: string, options?: RequestOptions) => json<T>(await send('GET', path, options)),
  post: async <T = void>(path: string, body?: unknown, options?: RequestOptions) =>
    json<T>(await send('POST', path, { ...options, body })),
  put: async <T = void>(path: string, body?: unknown, options?: RequestOptions) =>
    json<T>(await send('PUT', path, { ...options, body })),
  delete: async <T = void>(path: string, options?: RequestOptions) => json<T>(await send('DELETE', path, options)),
  /** A file download (CSV export): the body as a Blob. */
  blob: async (path: string, options?: RequestOptions) => (await send('GET', path, options)).blob(),
}
