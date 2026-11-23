import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { NoticeView } from '../../shared/ui/NoticeView'
import { useAction } from '../../shared/ui/useAction'
import { DRONE_TYPE_LABELS, type DroneType } from '../fleet/types'
import { missionsApi, type MissionAction } from './api'
import { EMPTY_LOCATION, formatDate, formatLocation, toLocation } from './format'
import { LocationFields } from './LocationFields'
import { MISSION_STATE_LABELS, PRIORITY_LABELS, type MissionResponse } from './types'

const ACTION_LABELS: Record<MissionAction, string> = {
  'authorize-takeoff': 'Autorizar despegue',
  pause: 'Pausar',
  resume: 'Reanudar',
  abort: 'Abortar',
}

/** Actions offered per state (HU-06, HU-08); the backend validates every transition. */
function actionsFor(mission: MissionResponse): MissionAction[] {
  switch (mission.state) {
    case 'PENDING':
      return mission.assignedDroneCode ? ['authorize-takeoff'] : []
    case 'TAKEOFF': // no HTTP event moves it to IN_PROGRESS yet; the backend answers with its reason
    case 'IN_PROGRESS':
      return ['pause', 'abort']
    case 'PAUSED':
      return ['resume', 'abort']
    default:
      return []
  }
}

/** Mission detail with progress state (HU-07) and manual actions (HU-06, HU-08). */
export function MissionDetailPage() {
  const { code = '' } = useParams()
  const created = (useLocation().state as { created?: boolean } | null)?.created
  const [mission, setMission] = useState<MissionResponse | null>(null)
  const [destination, setDestination] = useState(EMPTY_LOCATION)
  const { notice, busy, run, setNotice } = useAction()

  const load = useCallback(
    () => missionsApi.get(code).then(setMission, (e: Error) => setNotice({ ok: false, text: e.message })),
    [code, setNotice],
  )

  useEffect(() => {
    void load()
  }, [load])

  async function act(action: MissionAction) {
    if (action === 'abort' && !window.confirm(`¿Abortar la misión ${code}? El dron regresará a la base.`)) return
    const updated = await run(() => missionsApi.run(code, action), (m) => `Misión ${m.code}: ${MISSION_STATE_LABELS[m.state]}.`)
    if (updated) setMission(updated)
    else void load() // a failed takeoff may still change attempts or release the drone
  }

  async function handleRedirect(event: FormEvent) {
    event.preventDefault()
    const updated = await run(() => missionsApi.redirect(code, toLocation(destination)), () => 'Destino actualizado; ruta recalculada.')
    if (updated) {
      setMission(updated)
      setDestination(EMPTY_LOCATION)
    }
  }

  if (!mission) return <NoticeView notice={notice} />

  return (
    <section className="stack">
      <h1>Misión {mission.code}</h1>
      {created && !notice && (
        <p className="alert success">
          Misión creada en estado "{MISSION_STATE_LABELS[mission.state]}".{' '}
          {mission.assignedDroneCode ? `Dron asignado: ${mission.assignedDroneCode}.` : 'Aún no hay un dron compatible disponible.'}
        </p>
      )}
      <NoticeView notice={notice} />
      <dl className="details">
        <dt>Estado</dt><dd>{MISSION_STATE_LABELS[mission.state]}</dd>
        <dt>Tipo</dt><dd>{DRONE_TYPE_LABELS[mission.type as DroneType] ?? mission.type}</dd>
        <dt>Prioridad</dt><dd>{PRIORITY_LABELS[mission.priority]}</dd>
        <dt>Dron asignado</dt><dd>{mission.assignedDroneCode ?? 'Sin asignar'}</dd>
        <dt>Origen</dt><dd>{formatLocation(mission.origin)}</dd>
        <dt>Destino</dt><dd>{formatLocation(mission.destination)}</dd>
        <dt>Carga útil requerida</dt><dd>{mission.requiredPayload} kg</dd>
        <dt>Autonomía mínima</dt><dd>{mission.minEndurance} min</dd>
        <dt>Intentos de ruta</dt><dd>{mission.routeAttempts}</dd>
        <dt>Ruta</dt><dd>{mission.route ? mission.route.points.map((p) => p.name).join(' → ') : 'Sin calcular'}</dd>
        <dt>Creada</dt><dd>{formatDate(mission.createdAt)}</dd>
        <dt>Inicio</dt><dd>{formatDate(mission.start)}</dd>
        <dt>Fin</dt><dd>{formatDate(mission.end)}</dd>
      </dl>
      <div className="actions">
        {actionsFor(mission).map((action) => (
          <button key={action} disabled={busy} onClick={() => act(action)}>{ACTION_LABELS[action]}</button>
        ))}
        <button className="secondary" disabled={busy} onClick={() => void load()}>Actualizar</button>
      </div>
      {(mission.state === 'IN_PROGRESS' || mission.state === 'TAKEOFF') && (
        <form className="card" onSubmit={handleRedirect}>
          <h2>Redirigir a un nuevo destino</h2>
          <LocationFields legend="Nuevo destino" value={destination} onChange={setDestination} />
          <button disabled={busy}>Redirigir</button>
        </form>
      )}
      <Link to="/missions">Volver a misiones</Link>
    </section>
  )
}
