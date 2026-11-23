import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../../modules/users/api'
import { UNAUTHORIZED_EVENT } from '../api/http'
import { AuthContext } from './AuthContext'
import { getStoredSession, storeSession, type Session } from './session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(getStoredSession)

  const update = useCallback((next: Session | null) => {
    storeSession(next)
    setSession(next)
  }, [])

  useEffect(() => {
    const onUnauthorized = () => update(null)
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [update])

  const value = useMemo(
    () => ({
      session,
      login: async (userName: string, password: string) => {
        const { token, role } = await authApi.login({ userName, password })
        update({ token, role, userName })
      },
      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          update(null) // the local session ends even if the server call fails
        }
      },
    }),
    [session, update],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
