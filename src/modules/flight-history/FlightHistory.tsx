import { useEffect, useState } from 'react'
import { NoticeView } from '../../shared/ui/NoticeView'
import { useAction } from '../../shared/ui/useAction'
import { formatDate } from '../mission/format'
import { PRIORITY_LABELS } from '../mission/types'
import { flightHistoryApi } from './api'
import type { FlightHistoryResponse } from './types'

/** HU-13: flight hours, completed missions and incidents of a drone. */
export function FlightHistory({ droneCode }: { droneCode: string }) {
  const [history, setHistory] = useState<FlightHistoryResponse | null>(null)
  const { notice, setNotice } = useAction()

  useEffect(() => {
    flightHistoryApi.get(droneCode).then(setHistory, (e: Error) => setNotice({ ok: false, text: e.message }))
  }, [droneCode, setNotice])

  return (
    <div className="stack">
      <h2>Historial de vuelos</h2>
      <NoticeView notice={notice} />
      {history && (
        <>
          <dl className="details">
            <dt>Horas de vuelo</dt><dd>{history.flightHours}</dd>
            <dt>Misiones completadas</dt><dd>{history.completedMissions}</dd>
          </dl>
          {history.incidents.length === 0 ? (
            <p className="empty">Sin incidencias registradas.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Momento</th><th>Severidad</th><th>Misión</th><th>Alerta</th></tr></thead>
                <tbody>
                  {history.incidents.map((i) => (
                    <tr key={i.alertId}>
                      <td>{formatDate(i.moment)}</td>
                      <td><span className={`state severity-${i.severity}`}>{PRIORITY_LABELS[i.severity]}</span></td>
                      <td>{i.missionCode ?? '—'}</td>
                      <td>{i.alertId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
