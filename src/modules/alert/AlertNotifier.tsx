import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PRIORITY_LABELS } from '../mission/types'
import { alertsApi } from './api'
import { ALERT_TYPE_LABELS, type AlertResponse } from './types'

const MAX_VISIBLE = 5

/** HU-11: on-screen notification for every new alert while an administrator is logged in. */
export function AlertNotifier() {
  const [alerts, setAlerts] = useState<AlertResponse[]>([])

  useEffect(() => {
    const controller = new AbortController()
    void alertsApi.subscribe((alert) => setAlerts((current) => [alert, ...current].slice(0, MAX_VISIBLE)), controller.signal)
    return () => controller.abort()
  }, [])

  if (alerts.length === 0) return null

  return (
    <div className="toasts" role="status" aria-live="assertive">
      {alerts.map((alert) => (
        <div key={alert.id} className={`toast severity-${alert.severity}`}>
          <strong>{ALERT_TYPE_LABELS[alert.type]} · {PRIORITY_LABELS[alert.severity]}</strong>
          <span>Dron {alert.droneCode}{alert.missionCode && ` · Misión ${alert.missionCode}`}: {alert.detail}</span>
          <div className="actions">
            <Link to="/alerts">Ver alertas</Link>
            <button className="secondary" onClick={() => setAlerts((current) => current.filter((a) => a.id !== alert.id))}>Cerrar</button>
          </div>
        </div>
      ))}
    </div>
  )
}
