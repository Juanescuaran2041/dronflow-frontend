import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { LogoutButton } from '../../modules/users/LogoutButton'
import { AlertNotifier } from '../../modules/alert/AlertNotifier'

const link = ({ isActive }: { isActive: boolean }) =>
  `relative block shrink-0 rounded-campo px-3 py-2 text-sm font-medium no-underline transition-colors hover:no-underline ${
    isActive
      ? "bg-cabina-2 text-white lg:before:absolute lg:before:inset-y-2 lg:before:left-0 lg:before:w-[3px] lg:before:rounded-full lg:before:bg-acento-vivo lg:before:content-['']"
      : 'text-white/55 hover:bg-cabina-2/60 hover:text-white'
  }`

export function Layout() {
  const { session } = useAuth()

  return (
    <div className="min-h-dvh lg:flex">
      <aside className="flex flex-col gap-4 bg-cabina p-4 text-white lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:p-6">
        <div className="flex items-center gap-2.5 lg:border-b lg:border-white/10 lg:pb-5">
          <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7 shrink-0">
            <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
              <path d="M10.5 10.5 21.5 21.5M21.5 10.5 10.5 21.5" />
            </g>
            <g fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.5">
              <circle cx="9" cy="9" r="3.1" />
              <circle cx="23" cy="9" r="3.1" />
              <circle cx="9" cy="23" r="3.1" />
              <circle cx="23" cy="23" r="3.1" />
            </g>
            <circle cx="16" cy="16" r="3.4" className="fill-acento-vivo" />
          </svg>
          <strong className="text-lg font-semibold tracking-[-0.02em]">Dronflow</strong>
        </div>
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
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4 lg:flex-col lg:items-stretch lg:gap-3 [&_button]:border-white/25 [&_button]:text-white [&_button:hover]:border-white [&_button:hover]:bg-white [&_button:hover]:text-cabina">
          <span className="text-sm leading-snug text-white/70">
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
