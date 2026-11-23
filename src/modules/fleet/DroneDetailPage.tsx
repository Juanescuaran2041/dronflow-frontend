import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { NoticeView } from '../../shared/ui/NoticeView'
import { useAction } from '../../shared/ui/useAction'
import { FlightHistory } from '../flight-history/FlightHistory'
import { MaintenanceRecords } from '../maintenance-record/MaintenanceRecords'
import { dronesApi } from './api'
import { DRONE_STATE_LABELS, type DroneResponse } from './types'

/** Per-drone page that groups the drone's state, flight history and maintenance records. */
export function DroneDetailPage() {
  const { code = '' } = useParams()
  const [drone, setDrone] = useState<DroneResponse | null>(null)
  const { notice, setNotice } = useAction()

  const load = useCallback(
    () => dronesApi.get(code).then(setDrone, (e: Error) => setNotice({ ok: false, text: e.message })),
    [code, setNotice],
  )

  useEffect(() => {
    void load()
  }, [load])

  return (
    <section className="stack">
      <h1>Dron {code}</h1>
      <NoticeView notice={notice} />
      {drone && <p>Estado: <span className={`state state-${drone.state}`}>{DRONE_STATE_LABELS[drone.state]}</span></p>}
      <FlightHistory droneCode={code} />
      <MaintenanceRecords droneCode={code} inMaintenance={drone?.state === 'IN_MAINTENANCE'} onRecorded={() => void load()} />
      <Link to="/drones">Volver al listado</Link>
    </section>
  )
}
