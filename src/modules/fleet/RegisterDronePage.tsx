import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { errorMessage } from '../../shared/api/http'
import { dronesApi } from './api'
import { DRONE_STATE_LABELS, DRONE_TYPE_LABELS, DRONE_TYPES } from './types'

const EMPTY = { code: '', type: '', batteryCapacity: '', enduranceMin: '', maxPayload: '', equipment: '' }

/** HU-01: register a drone in the fleet. */
export function RegisterDronePage() {
  const [form, setForm] = useState(EMPTY)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const field = (name: keyof typeof EMPTY) => ({
    value: form[name],
    onChange: (e: { target: { value: string } }) => setForm({ ...form, [name]: e.target.value }),
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setMessage(null)
    setLoading(true)
    try {
      const drone = await dronesApi.register({
        code: form.code.trim(),
        type: form.type,
        batteryCapacity: Number(form.batteryCapacity),
        enduranceMin: Number(form.enduranceMin),
        maxPayload: Number(form.maxPayload),
        equipment: form.equipment.split(',').map((item) => item.trim()).filter(Boolean),
      })
      setMessage({ ok: true, text: `Dron ${drone.code} registrado con estado "${DRONE_STATE_LABELS[drone.state]}".` })
      setForm(EMPTY)
    } catch (e) {
      setMessage({ ok: false, text: errorMessage(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1>Registrar dron</h1>
      <label>
        Identificación
        <input {...field('code')} required placeholder="DRN-001" />
      </label>
      <label>
        Tipo
        <select {...field('type')} required>
          <option value="" disabled>Selecciona un tipo</option>
          {DRONE_TYPES.map((type) => <option key={type} value={type}>{DRONE_TYPE_LABELS[type]}</option>)}
        </select>
      </label>
      <label>
        Capacidad de batería (mAh)
        <input {...field('batteryCapacity')} type="number" min={1} step={1} required />
      </label>
      <label>
        Autonomía (minutos)
        <input {...field('enduranceMin')} type="number" min={1} step={1} required />
      </label>
      <label>
        Carga útil máxima (kg)
        <input {...field('maxPayload')} type="number" min={0.01} step={0.01} required />
      </label>
      <label>
        Equipamiento (separado por comas)
        <input {...field('equipment')} placeholder="cámara, gancho de carga" />
      </label>
      {message && <p className={`alert ${message.ok ? 'success' : 'error'}`} role="alert">{message.text}</p>}
      <button disabled={loading}>{loading ? 'Registrando…' : 'Registrar'}</button>
      <Link to="/drones">Volver al listado</Link>
    </form>
  )
}
