import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { errorMessage } from '../../shared/api/http'
import { dronesApi, type DroneAction } from './api'
import { DRONE_STATE_LABELS, DRONE_TYPE_LABELS, type DroneResponse, type DroneType } from './types'

const ACTION_LABELS: Record<DroneAction, string> = {
  'report-fault': 'Reportar avería',
  decommission: 'Dar de baja',
  reactivate: 'Reactivar',
}

/** Actions offered per state; the backend still validates every transition (409 otherwise). */
function actionsFor(drone: DroneResponse): DroneAction[] {
  const actions: DroneAction[] = []
  if (drone.state === 'AVAILABLE') actions.push('report-fault') // HU-02
  if (drone.state === 'OUT_OF_SERVICE' || drone.state === 'IN_MAINTENANCE') actions.push('reactivate') // HU-03
  actions.push('decommission') // HU-03: the backend rejects it while on a mission and explains why
  return actions
}

/** Fleet list (drones not decommissioned) with HU-02 and HU-03 actions. */
export function DronesPage() {
  const [drones, setDrones] = useState<DroneResponse[] | null>(null)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setDrones(await dronesApi.list())
    } catch (e) {
      setMessage({ ok: false, text: errorMessage(e) })
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching on mount
    void load()
  }, [load])

  async function run(drone: DroneResponse, action: DroneAction) {
    if (action === 'decommission' && !window.confirm(`¿Dar de baja el dron ${drone.code}? No se podrá reactivar.`)) return
    setMessage(null)
    setBusy(drone.code)
    try {
      const updated = await dronesApi.run(drone.code, action)
      setMessage({ ok: true, text: `Dron ${updated.code}: ${DRONE_STATE_LABELS[updated.state]}.` })
      await load()
    } catch (e) {
      setMessage({ ok: false, text: `Dron ${drone.code}: ${errorMessage(e)}` })
    } finally {
      setBusy(null)
    }
  }

  return (
    <section>
      <div className="toolbar">
        <h1>Drones</h1>
        <Link className="button" to="/drones/new">Registrar dron</Link>
      </div>
      {message && <p className={`alert ${message.ok ? 'success' : 'error'}`} role="alert">{message.text}</p>}
      {drones === null ? (
        <p>Cargando…</p>
      ) : drones.length === 0 ? (
        <p>No hay drones registrados.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Identificación</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Batería</th>
                <th>Capacidad (mAh)</th>
                <th>Autonomía (min)</th>
                <th>Carga máx. (kg)</th>
                <th>Equipamiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {drones.map((drone) => (
                <tr key={drone.code}>
                  <td><Link to={`/drones/${encodeURIComponent(drone.code)}`}>{drone.code}</Link></td>
                  <td>{DRONE_TYPE_LABELS[drone.type as DroneType] ?? drone.type}</td>
                  <td><span className={`state state-${drone.state}`}>{DRONE_STATE_LABELS[drone.state]}</span></td>
                  <td>{drone.batteryLevelPercent}%</td>
                  <td>{drone.batteryCapacity}</td>
                  <td>{drone.enduranceMin}</td>
                  <td>{drone.maxPayload}</td>
                  <td>{drone.equipment.join(', ') || '—'}</td>
                  <td className="actions">
                    {actionsFor(drone).map((action) => (
                      <button key={action} className="secondary" disabled={busy === drone.code} onClick={() => run(drone, action)}>
                        {ACTION_LABELS[action]}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
