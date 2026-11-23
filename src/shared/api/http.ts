import { getStoredSession } from '../auth/session'

/** Error body returned by the backend: {status, error, message, path}. */
export interface ApiErrorBody {
  status: number
  error: string
  message: string
  path: string
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const UNAUTHORIZED_EVENT = 'dronflow:unauthorized'

const BASE_URL = '/api/v1'

/** Sends a JSON request with the session's JWT and throws ApiError with the backend message. */
export async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = getStoredSession()?.token
  const response = await fetch(BASE_URL + path, {
    method: init.method ?? 'GET',
    headers: {
      ...(init.body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as Partial<ApiErrorBody> | null
    // A rejected token (expired or revoked) ends the session; the login's own 401 is not a session error.
    if (response.status === 401 && token) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    const fallback = response.status === 403 ? 'No tienes permiso para realizar esta acción.' : `Error ${response.status}`
    throw new ApiError(response.status, body?.message ?? fallback)
  }
  return (response.status === 204 ? undefined : await response.json()) as T
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Error inesperado'
}
