import { useState, type FormEvent } from 'react'
import { errorMessage } from '../../shared/api/http'
import { usersApi } from './api'

/** HU-20: an administrator registers a new operator account. */
export function RegisterOperatorPage() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setMessage(null)
    setLoading(true)
    try {
      const user = await usersApi.create({ userName, password })
      setMessage({ ok: true, text: `Operador "${user.username}" registrado.` })
      setUserName('')
      setPassword('')
    } catch (e) {
      setMessage({ ok: false, text: errorMessage(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1>Registrar operador</h1>
      <label>
        Nombre de usuario
        <input value={userName} onChange={(e) => setUserName(e.target.value)} required autoComplete="off" />
      </label>
      <label>
        Contraseña (mínimo 8 caracteres)
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
      </label>
      {message && <p className={`alert ${message.ok ? 'success' : 'error'}`} role="alert">{message.text}</p>}
      <button disabled={loading}>{loading ? 'Registrando…' : 'Registrar'}</button>
    </form>
  )
}
