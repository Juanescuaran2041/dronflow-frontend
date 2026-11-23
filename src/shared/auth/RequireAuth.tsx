import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import type { Role } from '../../modules/users/types'
import { useAuth } from './AuthContext'

/** Renders children only for an authenticated user, optionally restricted to some roles. */
export function RequireAuth({ roles, children }: { roles?: Role[]; children: ReactNode }) {
  const { session } = useAuth()
  const location = useLocation()

  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(session.role)) {
    return <p className="alert error">No tienes permiso para acceder a esta sección.</p>
  }
  return children
}
