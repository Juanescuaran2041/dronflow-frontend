import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { NoticeView } from '../../shared/ui/NoticeView'
import { useAction } from '../../shared/ui/useAction'
import { DRONE_TYPE_LABELS, DRONE_TYPES } from '../fleet/types'
import { missionsApi } from './api'
import { EMPTY_LOCATION, toLocation } from './format'
import { LocationFields } from './LocationFields'
import { PRIORITIES, PRIORITY_LABELS, type Priority } from './types'

/** HU-04: create a mission; the backend then tries to assign a drone (HU-05). */
export function CreateMissionPage() {
  const navigate = useNavigate()
  const { notice, busy, run } = useAction()
  const [type, setType] = useState('')
  const [priority, setPriority] = useState('')
  const [origin, setOrigin] = useState(EMPTY_LOCATION)
  const [destination, setDestination] = useState(EMPTY_LOCATION)
  const [requiredPayload, setRequiredPayload] = useState('')
  const [minEndurance, setMinEndurance] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const mission = await run(() =>
      missionsApi.create({
        type,
        priority: priority as Priority,
        origin: toLocation(origin),
        destination: toLocation(destination),
        requiredPayload: Number(requiredPayload),
        minEndurance: Number(minEndurance),
      }),
    )
    if (mission) navigate(`/missions/${encodeURIComponent(mission.code)}`, { state: { created: true } })
  }

  return (
    <form className="card wide" onSubmit={handleSubmit}>
      <h1>Crear misión</h1>
      <label>
        Tipo
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="" disabled>Selecciona un tipo</option>
          {DRONE_TYPES.map((t) => <option key={t} value={t}>{DRONE_TYPE_LABELS[t]}</option>)}
        </select>
      </label>
      <label>
        Prioridad
        <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
          <option value="" disabled>Selecciona una prioridad</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
        </select>
      </label>
      <div className="grid">
        <LocationFields legend="Origen" value={origin} onChange={setOrigin} />
        <LocationFields legend="Destino" value={destination} onChange={setDestination} />
      </div>
      <label>
        Carga útil requerida (kg)
        <input type="number" min={0.01} step="any" required value={requiredPayload} onChange={(e) => setRequiredPayload(e.target.value)} />
      </label>
      <label>
        Autonomía mínima (minutos)
        <input type="number" min={1} step={1} required value={minEndurance} onChange={(e) => setMinEndurance(e.target.value)} />
      </label>
      <NoticeView notice={notice} />
      <button disabled={busy}>{busy ? 'Creando…' : 'Crear misión'}</button>
    </form>
  )
}
