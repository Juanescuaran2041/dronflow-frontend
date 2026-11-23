import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { LogoutButton } from '../../modules/users/LogoutButton'

export function Layout() {
  const { session } = useAuth()

  return (
    <>
      <header className="topbar">
        <strong>Dronflow</strong>
        <nav>
          <NavLink to="/drones" end>Drones</NavLink>
          <NavLink to="/missions">Misiones</NavLink>
          {session?.role === 'ADMIN' && (
            <>
              <NavLink to="/configuration">Configuración</NavLink>
              <NavLink to="/users/new">Registrar operador</NavLink>
            </>
          )}
        </nav>
        <span className="who">
          {session?.userName} ({session?.role === 'ADMIN' ? 'Administrador' : 'Operador'})
        </span>
        <LogoutButton />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
