import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { LogoutButton } from '../../modules/users/LogoutButton'
import { AlertNotifier } from '../../modules/alert/AlertNotifier'

const link = ({ isActive }: { isActive: boolean }) =>
  `block shrink-0 rounded-full px-4 py-2 text-sm font-medium no-underline transition-colors hover:no-underline ${
    isActive ? 'bg-cabina-2 text-white' : 'text-white/60 hover:bg-cabina-2/60 hover:text-white'
  }`

export function Layout() {
  const { session } = useAuth()

  return (
    <div className="min-h-dvh lg:flex">
      <aside className="flex flex-col gap-4 bg-cabina p-4 text-white lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:p-6">
        <strong className="text-xl tracking-tight">
          Dron<span className="text-acento-vivo">flow</span>
        </strong>
        <nav className="flex gap-1 overflow-x-auto lg:flex-1 lg:flex-col">
          <NavLink to="/drones" end className={link}>Drones</NavLink>
          <NavLink to="/missions" className={link}>Misiones</NavLink>
          {session?.role === 'ADMIN' && (
            <>
              <NavLink to="/alerts" className={link}>Alertas</NavLink>
              <NavLink to="/maintenance-recommendations" className={link}>Mantenimiento</NavLink>
              <NavLink to="/configuration" className={link}>Configuración</NavLink>
              <NavLink to="/users/new" className={link}>Registrar operador</NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center justify-between gap-3 [&_button]:border-white/20 [&_button]:text-white border-t border-white/10 pt-4 lg:flex-col lg:items-stretch">
          <span className="text-sm text-white/70">
            {session?.userName} ({session?.role === 'ADMIN' ? 'Administrador' : 'Operador'})
          </span>
          <LogoutButton />
        </div>
      </aside>
      <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
      {session?.role === 'ADMIN' && <AlertNotifier />}
    </div>
  )
}
