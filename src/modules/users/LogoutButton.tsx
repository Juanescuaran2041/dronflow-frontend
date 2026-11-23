import { useNavigate } from 'react-router'
import { useAuth } from '../../shared/auth/AuthContext'

/** HU-23: ends the session; the backend revokes the token. */
export function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleClick() {
    await logout().catch(() => undefined) // the session is cleared locally regardless
    navigate('/login', { replace: true })
  }

  return <button className="secondary" onClick={handleClick}>Cerrar sesión</button>
}
