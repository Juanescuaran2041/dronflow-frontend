import { useEffect, useState } from 'react'
import { NoticeView } from '../../shared/ui/NoticeView'
import { useAction } from '../../shared/ui/useAction'
import { formatDate } from '../mission/format'
import { PRIORITY_LABELS } from '../mission/types'
import { alertsApi } from './api'
import { ALERT_TYPES, ALERT_TYPE_LABELS, SEVERITIES, type AlertResponse, type AlertType, type Severity } from './types'

/** HU-12: alerts with their severity, filtered by type and severity (ADMIN only). */
export function AlertsPage() {
  const [type, setType] = useState('')
  const [severity, setSeverity] = useState('')
  const [alerts, setAlerts] = useState<AlertResponse[] | null>(null)
  const [refresh, setRefresh] = useState(0)
  const { notice, setNotice } = useAction()

  useEffect(() => {
    alertsApi
      .list({ type: (type || undefined) as AlertType, severity: (severity || undefined) as Severity })
      .then(setAlerts, (e: Error) => setNotice({ ok: false, text: e.message }))
  }, [type, severity, refresh, setNotice])

  return (
    <section className="stack">
      <h1>Alertas</h1>
      <div className="inline">
        <label>
          Tipo
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Todos</option>
            {ALERT_TYPES.map((t) => <option key={t} value={t}>{ALERT_TYPE_LABELS[t]}</option>)}
          </select>
        </label>
        <label>
          Severidad
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="">Todas</option>
            {SEVERITIES.map((s) => <option key={s} value={s}>{PRIORITY_LABELS[s]}</option>)}
          </select>
        </label>
        <button className="secondary" onClick={() => setRefresh((n) => n + 1)}>Actualizar</button>
      </div>
      <NoticeView notice={notice} />
      {alerts?.length === 0 && <p className="empty">No hay alertas que coincidan con los filtros.</p>}
      {!!alerts?.length && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Fecha</th><th>Tipo</th><th>Severidad</th><th>Dron</th><th>Misión</th><th>Detalle</th></tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id}>
                  <td>{formatDate(a.generatedAt)}</td>
                  <td>{ALERT_TYPE_LABELS[a.type]}</td>
                  <td><span className={`state severity-${a.severity}`}>{PRIORITY_LABELS[a.severity]}</span></td>
                  <td>{a.droneCode}</td>
                  <td>{a.missionCode ?? '—'}</td>
                  <td>{a.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
