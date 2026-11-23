import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../shared/auth/AuthContext'
import { NoticeView } from '../../shared/ui/NoticeView'
import { useAction } from '../../shared/ui/useAction'
import { missionsApi } from './api'
import { formatDate } from './format'
import { MISSION_STATES, MISSION_STATE_LABELS, PRIORITY_LABELS, type MissionResponse, type MissionState } from './types'

/** Open a mission by code (everyone) and, for ADMIN, query the mission history (HU-17). */
export function MissionsPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  function open(event: FormEvent) {
    event.preventDefault()
    navigate(`/missions/${encodeURIComponent(code.trim())}`)
  }

  return (
    <section className="stack">
      <div className="toolbar">
        <h1>Misiones</h1>
        <Link className="button" to="/missions/new">Crear misión</Link>
      </div>
      <form className="inline" onSubmit={open}>
        <label>
          Código de misión
          <input value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        <button>Abrir</button>
      </form>
      {session?.role === 'ADMIN' && <MissionHistory />}
    </section>
  )
}

function MissionHistory() {
  const [filter, setFilter] = useState({ droneCode: '', from: '', to: '', state: '' })
  const [missions, setMissions] = useState<MissionResponse[] | null>(null)
  const { notice, busy, run } = useAction()

  async function search(event: FormEvent) {
    event.preventDefault()
    const result = await run(() =>
      missionsApi.search({
        droneCode: filter.droneCode.trim(),
        from: filter.from && new Date(filter.from).toISOString(),
        to: filter.to && new Date(filter.to).toISOString(),
        state: (filter.state || undefined) as MissionState | undefined,
      }),
    )
    if (result) setMissions(result)
  }

  const field = (name: keyof typeof filter) => ({
    value: filter[name],
    onChange: (e: { target: { value: string } }) => setFilter({ ...filter, [name]: e.target.value }),
  })

  return (
    <>
      <h2>Historial de misiones</h2>
      <form className="inline" onSubmit={search}>
        <label>Dron<input {...field('droneCode')} placeholder="DRN-001" /></label>
        <label>Desde<input type="datetime-local" {...field('from')} /></label>
        <label>Hasta<input type="datetime-local" {...field('to')} /></label>
        <label>
          Estado
          <select {...field('state')}>
            <option value="">Todos</option>
            {MISSION_STATES.map((s) => <option key={s} value={s}>{MISSION_STATE_LABELS[s]}</option>)}
          </select>
        </label>
        <button disabled={busy}>Consultar</button>
      </form>
      <NoticeView notice={notice} />
      {missions?.length === 0 && <p className="empty">No hay misiones que coincidan con los filtros.</p>}
      {!!missions?.length && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Código</th><th>Estado</th><th>Prioridad</th><th>Dron</th><th>Origen</th><th>Destino</th><th>Creada</th><th>Fin</th></tr>
            </thead>
            <tbody>
              {missions.map((m) => (
                <tr key={m.code}>
                  <td><Link to={`/missions/${encodeURIComponent(m.code)}`}>{m.code}</Link></td>
                  <td>{MISSION_STATE_LABELS[m.state]}</td>
                  <td>{PRIORITY_LABELS[m.priority]}</td>
                  <td>{m.assignedDroneCode ?? '—'}</td>
                  <td>{m.origin.name}</td>
                  <td>{m.destination.name}</td>
                  <td>{formatDate(m.createdAt)}</td>
                  <td>{formatDate(m.end)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
