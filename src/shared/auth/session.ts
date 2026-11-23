import type { Role } from '../../modules/users/types'

export interface Session {
  token: string
  role: Role
  userName: string
}

const KEY = 'dronflow.session'

export function getStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function storeSession(session: Session | null): void {
  if (session) localStorage.setItem(KEY, JSON.stringify(session))
  else localStorage.removeItem(KEY)
}
