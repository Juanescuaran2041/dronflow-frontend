import { useAuth } from '../../shared/auth/AuthContext'

export function HomePage() {
  const { session } = useAuth()
  return <h1>Bienvenido, {session?.userName}</h1>
}
