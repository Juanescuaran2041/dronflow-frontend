import { createContext, useContext } from 'react'
import type { Session } from './session'

export interface AuthContextValue {
  session: Session | null
  login: (userName: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
