/**
 * A refused call: the HTTP status and the server's problem details. `code` is the stable error code
 * (src/server/ERROR_CODES.md), `field` names the empty value of a `blank` refusal, `message` is the server's English
 * `detail`, kept as a fallback for codes the client does not know.
 */
export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly field?: string

  constructor(status: number, message: string, code?: string, field?: string) {
    super(message)
    this.status = status
    this.code = code
    this.field = field
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
  throw await apiError(response)
}

interface Problem {
  detail?: string
  title?: string
  code?: string
  field?: string
}

async function apiError(response: Response) {
  let problem: Problem = {}
  try {
    problem = (await response.json()) as Problem
  } catch {
    // Not problem details (a proxy error page, an empty body): the status text has to do.
  }
  return new ApiError(response.status, problem.detail ?? problem.title ?? response.statusText, problem.code, problem.field)
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
