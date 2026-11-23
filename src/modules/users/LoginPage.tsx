import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { errorMessage } from '../../shared/api/http'
import { useAuth } from '../../shared/auth/AuthContext'

/** HU-19: authentication with user name and password. */
export function LoginPage() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/'
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to={from} replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(userName, password)
      navigate(from, { replace: true })
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="center">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Dronflow</h1>
        <p>Inicia sesión para continuar</p>
        <label>
          Usuario
          <input value={userName} onChange={(e) => setUserName(e.target.value)} required autoFocus autoComplete="username" />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>
        {error && <p className="alert error" role="alert">{error}</p>}
        <button disabled={loading}>{loading ? 'Ingresando…' : 'Iniciar sesión'}</button>
      </form>
    </main>
  )
}
